const express = require("express");
const router = express.Router();

const friendsRouter = require("./friends");

const { upload } = require("../utils/imgs");
const routeMiddleware = require("../utils/routeMiddleware");
const usersController = require("../controllers/usersController");

// ⭐ Current Route: "/api/users" ⭐

/* ❗ Routes ❗ */
// GET All users (returns basic information - name & profile picture)
router.get("/", usersController.getAllUsers);
// DELETE route for deleting OWN account
router.delete("/", usersController.deleteAccount);

/* Update based on req.userId (extracted from jwt token) */
// PUT route for updating own profile
router.put("/profile", usersController.updateProfile);
// PUT route for updating password
router.put("/password", usersController.updatePassword);
// PUT route for updating own profile picture
router.put(
  "/profilepic",
  upload.single("profileImg"),
  usersController.updateProfilePic
);
// DELETE route for removing profile picture
router.delete("/profilepic", usersController.removeProfilePic);

/* 🖱️ Middlewares 🖱️ */
// :userId parameter must link to a valid user & sets req.currentUser to that user found
router.use("/:userId", routeMiddleware.validUserId);
// Get all relations viewing user has with :userId
router.use("/:userId", routeMiddleware.getRelations);

/* ❗ Routes ❗ */
// GET user info (different values depending on viewing user)
router.get("/:userId", usersController.getUser);

// Route for handling friends
router.use("/:userId/friends", friendsRouter);

module.exports = router;
