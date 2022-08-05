const express = require("express");
const router = express.Router();
const passport = require("passport");

const authController = require("../controllers/authController");

// ⭐ Current Route: "/api/auth" ⭐

/* Handle user signups */
router.post("/signup", authController.signupPost);

/* Handle non-Facebook logins */
router.post("/login", authController.normLoginPost);

/* Handle Facebook logins */
router.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"], session: false })
);

router.get(
  "/redirect/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
    failureRedirect: "/api/auth/login/facebook",
    failureMessage: true,
  }),
  authController.facebookLoginGet
);

/* Verify if JWT token is still valid */
router.get(
  "/validateToken",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    return res.status(200).json({ message: "Token is valid." });
  }
);

module.exports = router;
