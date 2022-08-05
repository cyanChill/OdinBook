const express = require("express");
const router = express.Router();
const passport = require("passport");

const { readToken } = require("../utils/jwt");
const authRoutes = require("./auth");
const usersRoutes = require("./users");
const postsRoutes = require("./posts");

router.get("/", async (req, res, next) => {
  return res.status(200).json({ message: "Successfully pinged api." });
});

/* ❗ Middlewares ❗ */
// User must be logged in to access the following route
router.use(passport.authenticate("jwt", { session: false }));
// Set req.userId to "id" value found in JWT token
router.use(readToken);

/* ❗ Routes ❗ */
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/posts", postsRoutes);

module.exports = router;
