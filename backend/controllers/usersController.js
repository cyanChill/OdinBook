const { body, validationResult } = require("express-validator");

const { hashPassword } = require("../utils/hash.js");
const {
  validateImg,
  convertImgAndUploadToFirebase,
  deleteImageFromUrl,
  isFirebaseImg,
  deleteAllUserImgs,
} = require("../utils/imgs");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "first_name last_name profilePicUrl");
    return res.status(200).json({
      message: "Successfully found users.",
      users: users ? users : [],
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong on the server.",
    });
  }
};

exports.getUser = async (req, res, next) => {
  let user;
  if (!req.isFriendOrOwner) {
    // If current user isn't friend of :userId, return basic information
    user = await User.findById(
      req.params.userId,
      "first_name last_name profilePicUrl friendRequests"
    );
  } else {
    user = await User.findById(req.params.userId)
      .populate("posts")
      .populate("friendRequests", "first_name last_name profilePicUrl")
      .populate("friends", "first_name last_name profilePicUrl");
  }
  return res.status(200).json({
    message: "Successfully found user.",
    user: user,
  });
};

exports.updateProfile = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name is required.")
    .isAlpha("en-US")
    .withMessage("First name must contain only alphabet characters."),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name is required.")
    .isAlpha("en-US")
    .withMessage("Last name must contain only alphabet characters."),
  body("email", "An email is required.").trim().isEmail().escape(),
  body("new_password", "Password must be atleast 6 characters long.")
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 6 })
    .escape(),
  body(
    "confirm_password",
    "Confirm Password must be atleast 6 characters long."
  )
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 6 })
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const userId = req.userId;
    const { first_name, last_name, email } = req.body;
    const { new_password, confirm_password } = req.body;

    let updatedUserBody = {
      first_name: first_name,
      last_name: last_name,
      email: email.toLowerCase(),
    };

    // Validate "new" email
    try {
      const emailExists = await User.findOne({
        email: updatedUserBody.email,
        _id: { $ne: userId },
      });
      if (emailExists) errors.errors.push({ msg: "Email is already used." });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong on the server.",
      });
    }

    if (!errors.isEmpty()) {
      return res.status(409).json({
        message: "Something is wrong with your input(s).",
        inputData: updatedUserBody,
        errors: errors.array(),
      });
    }

    // See if we need to update password
    if (new_password || confirm_password) {
      if (new_password !== confirm_password) {
        return res.status(409).json({
          message: "Passwords aren't the same.",
          errors: [{ msg: "Passwords aren't the same." }],
          inputData: {
            ...updatedUserBody,
            new_password: new_password,
            confirm_password: confirm_password,
          },
        });
      } else {
        const hashedPassword = await hashPassword(new_password);
        updatedUserBody.password = hashedPassword;
      }
    }

    // All checks pass, update user profile
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updatedUserBody,
        { new: true }
      );
      return res.status(200).json({
        message: "Successfully updated user profile.",
        user: updatedUser,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong when updating your user profile.",
      });
    }
  },
];

exports.updateProfilePic = async (req, res, next) => {
  const errors = [];
  validateImg(req.file, errors);
  if (errors.length > 0) {
    return res.status(409).json({
      message: "Failed image validation.",
      errors: errors,
    });
  }

  let downloadUrl;
  // Image can be converted & uploaded to firebase
  try {
    downloadUrl = await convertImgAndUploadToFirebase(req.file, req.userId);
    const oldUserData = await User.findByIdAndUpdate(req.userId, {
      profilePicUrl: downloadUrl,
    });
    // Previous profile image url
    const prevImgUrl = oldUserData.profilePicUrl;
    // Only delete firebase images
    if (isFirebaseImg(prevImgUrl)) await deleteImageFromUrl(prevImgUrl);

    return res.status(200).json({
      message: "Successfully updated profile picture.",
      profilePicUrl: downloadUrl,
    });
  } catch (err) {
    // Delete image uploaded to firebase if it exists (was uploaded)
    if (downloadUrl) await deleteImageFromUrl(downloadUrl);

    return res.status(500).json({
      message: "An error has occurred when updating your profile picture.",
    });
  }
};

exports.deleteAccount = async (req, res, next) => {
  const userId = req.userId;
  try {
    const [commentsMade, postsMade] = await Promise.all([
      // Get all comments & all posts user made
      Comment.find({ user: userId }),
      Post.find({ author: userId }),
      // Delete all friends & friend requests
      User.updateMany({ friends: userId }, { $pull: { friends: userId } }),
      User.updateMany(
        { friendRequests: userId },
        { $pull: { friendRequests: userId } }
      ),
      // Remove all likes user made
      Post.updateMany({ likes: userId }, { $pull: { likes: userId } }),
      Comment.updateMany({ likes: userId }, { $pull: { likes: userId } }),
    ]);
    // Promises to remove all comments user made (comment reference in posts)
    const cmtPromises = commentsMade.map((cmt) => {
      return Post.findByIdAndUpdate(cmt.post, { $pull: { comments: cmt._id } });
    });
    // Promise to remove all comments for the posts user made
    const postCmtPromises = postsMade.map((pst) => {
      return Comment.deleteMany({ post: pst._id });
    });
    await Promise.all([...cmtPromises, ...postCmtPromises]);

    await Promise.all([
      // Delete all posts & comments as we removed any reference to them
      Post.deleteMany({ author: userId }),
      Comment.deleteMany({ author: userId }),
      // Delete images by user in firebase
      deleteAllUserImgs(userId),
    ]);

    // Delete user as we've deleted all content related to them
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "Successfully deleted account." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong with deleting your account.",
    });
  }
};
