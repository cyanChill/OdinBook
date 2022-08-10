const { body, validationResult } = require("express-validator");
const passport = require("passport");

const { hashPassword } = require("../utils/hash");
const { issueToken } = require("../utils/jwt");
const User = require("../models/User");

exports.signup = [
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
  body("password", "Password must be atleast 6 characters long.")
    .trim()
    .isLength({ min: 6 }),
  body(
    "confirm_password",
    "Confirm Password must be atleast 6 characters long."
  )
    .trim()
    .isLength({ min: 6 }),

  async (req, res, next) => {
    const errors = validationResult(req);

    let userBody = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email.toLowerCase(),
      profilePicUrl: "",
    };

    try {
      const user = await User.findOne({ email: userBody.email });
      if (user) errors.errors.push({ msg: "Email is already used." });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong on the server.",
      });
    }

    if (req.body.password !== req.body.confirm_password) {
      errors.errors.push({ msg: "Passwords aren't the same." });
    }

    if (!errors.isEmpty()) {
      return res.status(409).json({
        message: "Something is wrong with your input.",
        inputData: userBody,
        errors: errors.array(),
      });
    }
    // To not send hashed password back to frontend
    const hashedPassword = await hashPassword(req.body.password);
    userBody.password = hashedPassword;

    // User data is valid — sign user up
    try {
      const newUser = await User.create(userBody);
      const token = issueToken(newUser);
      return res.status(201).json({
        message: "Successfully signed up user.",
        user: {
          id: newUser._id,
          profilePicUrl: newUser.profilePicUrl,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          fullName: newUser.full_name,
        },
        token: token,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong when creating your user.",
      });
    }
  },
];

exports.normalLogin = async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(400).json({
        message: "Something went wrong with authentication.",
      });
    }
    if (!user) return res.status(400).json(info);
    // We've logged in with valid credentials — return a token
    try {
      const token = issueToken(user);
      return res.status(200).json({
        message: "Successfully logged in.",
        user: {
          id: user._id,
          profilePicUrl: user.profilePicUrl,
          firstName: user.first_name,
          lastName: user.last_name,
          fullName: user.full_name,
        },
        token: token,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong when creating your user token.",
      });
    }
  })(req, res);
};

exports.facebookLogin = async (req, res, next) => {
  // Successfuly authentication, send back token
  try {
    const token = issueToken(req.user);
    res.cookie("auth", token);
    return res.redirect(`${process.env.FRONTEND_URL}/login`);
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong when creating your user token.",
    });
  }
};
