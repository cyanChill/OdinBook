const express = require("express");
const router = express.Router({ mergeParams: true });

const routeMiddleware = require("../utils/routeMiddleware");
const friendsController = require("../controllers/friendsController");

// ⭐ Current Route: "/api/users/:userId/friends" ⭐

/* 🖱️ Middlewares 🖱️ */
// ⭐ We have the middleware from the "/users" route as well

/* ❗ Routes ❗ */
// GET route for getting all friends
router.get("/", friendsController.getFriends);

// GET route for getting all friend requests (populated)
router.get("/requests", friendsController.getFriendRequests);
// PUT route for toggling friend requests (request/cancel request)
router.put("/requests", friendsController.toggleFriendRequest);

// PUT route for accepting or rejecting friend requests
router.put(
  "/:requesterId/handle",
  routeMiddleware.isProfileOwner,
  friendsController.handleFriendRequest
);

// DELETE route for deleting friends
router.delete("/:friendId/remove", friendsController.removeFriend);

module.exports = router;
