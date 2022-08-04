const { body, validationResult } = require("express-validator");

const { hashPassword } = require("../utils/hash.js");
const User = require("../models/User");

exports.allUsersGet = async (req, res, next) => {
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

exports.userGet = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("posts")
      .populate("friends")
      .populate("friendRequests");
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

exports.updateProfilePut = [
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
    const { userId } = req.params;

    // Validate "new" email
    try {
      const emailExists = await User.findOne({
        email: req.body.email,
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
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
    };

    if (!errors.isEmpty()) {
      return res.status(409).json({
        message: "Something is wrong with your input(s).",
        inputData: updatedUserBody,
        errors: errors.errors,
      });
    }

    // See if we need to update password
    if (req.body.new_password) {
      if (req.body.new_password !== req.body.confirm_password) {
        return res.status(409).json({
          message: "Passwords are not the same.",
          inputData: {
            ...updatedUserBody,
            new_password: req.body.new_password,
            confirm_password: req.body.confirm_password,
          },
        });
      } else {
        const hashedPassword = await hashPassword(req.body.new_password);
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

exports.updateProfilePicPut = async (req, res, next) => {
  return res.status(501).json({ message: "Route not implemented." });
};
