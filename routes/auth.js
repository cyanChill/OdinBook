const express = require("express");
const router = express.Router();
const passport = require("passport");

const authController = require("../controllers/authController");

// ⭐ Current Route: "/api/auth" ⭐

/* Handle user signups */
router.post("/signup", authController.signup);

/* Handle non-Facebook logins */
router.post("/login", authController.normalLogin);

/* Handle Facebook logins */
router.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"], session: false })
);

router.get(
  "/facebook/redirect",
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}`,
    failureMessage: true,
  }),
  authController.facebookLogin
);

/* Verify if JWT token is still valid */
router.get(
  "/validateToken",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    return res.status(200).json({
      message: "Token is valid.",
      user: {
        id: req.user._id,
        profilePicUrl: req.user.profilePicUrl,
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        fullName: req.user.full_name,
      },
    });
  }
);

module.exports = router;
