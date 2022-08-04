const express = require("express");
const router = express.Router();
const passport = require("passport");

const authController = require("../controllers/authController");

/* Handle User Signups */
router.post("/signup", authController.signupPost);

/* Handle Non-Facebook Login */
router.post("/login", authController.normLoginPost);

/* Handle Facebook Login */
router.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"], session: false })
);

router.get(
  "/redirect/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
    failureRedirect: "/login/facebook",
    failureMessage: true,
  }),
  authController.facebookLoginGet
);

/* Verify If JWT Token is Still Valid */
router.get(
  "/validateToken",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    return res.status(200).json({ message: "Token is valid." });
  }
);

module.exports = router;
