const express = require("express");
const router = express.Router();
const passport = require("passport");
const rateLimit = require("express-rate-limit");

const authController = require("../controllers/authController");

const limiterSignup = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per 'window'
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const limiterLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per 'window'
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// ⭐ Current Route: "/api/auth" ⭐

/* Handle user signups */
router.use("/signup", limiterSignup);
router.post("/signup", authController.signup);

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

/* Apply this rate limiter to the "regular" login routes below */
router.use(limiterLogin);

/* Handle non-Facebook logins */
router.post("/login", authController.normalLogin);

/* Login as Demo Account */
router.get("/login/demo", authController.demoLogin);

module.exports = router;
