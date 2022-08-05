const { body, validationResult } = require("express-validator");

const { hashPassword } = require("../utils/hash.js");
const {
  validateImg,
  convertImgAndUploadToFirebase,
  deleteImageFromUrl,
  isFirebaseImg,
} = require("../utils/imgs");
const User = require("../models/User");

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
  try {
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
        .populate("friends", "first_name last_name profilePicUrl");
    }
    return res.status(200).json({
      message: "Successfully found user.",
      user: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong on the server.",
    });
  }
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
  body("confirm_password", "Password must be atleast 6 characters long.")
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 6 })
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const userId = req.userId;
    const { first_name, last_name, email } = req.body;
    const { new_password, confirm_password } = req.body;

    // Validate "new" email
    try {
      const emailExists = await User.findOne({
        email: email,
        _id: { $ne: userId },
      });
      if (emailExists) {
        return res.status(409).json({
          message: "User with that email already exists.",
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong on the server." });
    }

    let updatedUserBody = {
      first_name: first_name,
      last_name: last_name,
      email: email,
    };

    if (!errors.isEmpty()) {
      return res.status(409).json({
        message: "Something is wrong with your input(s).",
        inputData: updatedUserBody,
        errors: errors.array(),
      });
    }

    // See if we need to update password
    if (new_password) {
      if (new_password !== confirm_password) {
        return res.status(409).json({
          message: "Passwords are not the same.",
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
    // Prevent attempting to delete facebook images
    if (isFirebaseImg(prevImgUrl)) await deleteImageFromUrl(prevImgUrl);

    return res.status(200).json({
      message: "Successfully updated profile picture.",
      profilePicUrl: downloadUrl,
    });
  } catch (err) {
    console.log(err);
    // Delete image uploaded to firebase if it exists (was uploaded)
    if (downloadUrl) await deleteImageFromUrl(downloadUrl);

    return res.status(500).json({
      message: "An error has occurred when updating your profile picture.",
    });
  }
};

exports.deleteAccount = async (req, res, next) => {
  return res.status(501).json({ message: "Route not implemented." });
};
