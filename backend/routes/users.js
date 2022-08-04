const express = require("express");
const router = express.Router();

const routeMiddleware = require("../utils/routeMiddleware");
const usersController = require("../controllers/usersController");

/* ❗ Middlewares ❗ */
// :userId parameter must link to a valid user
router.use("/:userId", routeMiddleware.validUserId);
// Given the :userId is valid, check if viewer is the friend or owner of :userId
router.use("/:userId", routeMiddleware.isFriendOrOwner);

/* ❗ Routes ❗ */
// GET All users (returns basic information such as name & profile picture)
router.get("/", usersController.allUsersGet);

// GET user info (different values depending on viewing user)
router.get("/:userId", usersController.userGet);

// PUT route for updating user profile (updater must own profile)
router.put(
  "/:userId/profile",
  routeMiddleware.isProfileOwner,
  usersController.updateProfilePut
);

// PUT route for updating user profile picture (updater must own profile)
router.put(
  "/:userId/profilepic",
  routeMiddleware.isProfileOwner,
  usersController.updateProfilePicPut
);

// DELETE route for deleting user
router.delete(
  "/:userId",
  routeMiddleware.isProfileOwner,
  usersController.userDelete
);

module.exports = router;
