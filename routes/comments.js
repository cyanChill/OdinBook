const express = require("express");
const router = express.Router({ mergeParams: true });

const routeMiddleware = require("../utils/routeMiddleware");
const commentsController = require("../controllers/commentsController");

// ⭐ Current Route: "/api/posts/:postId/comments" ⭐

/* ❗ Routes ❗ */
// POST route for adding comment to current post
router.post("/", commentsController.postComment);

/* 🖱️ Middlewares 🖱️ */
// ⭐ We have the middleware from the "/posts" route as well
// :commentId parameter must link to a valid comment (sets req.currentComment)
router.use("/:commentId", routeMiddleware.validCommentId);

/* ❗ Routes ❗ */
// DELETE route for deleting comment
router.delete("/:commentId", commentsController.deleteComment);

// PUT route for liking/unliking a comment
router.put("/:commentId/like", commentsController.likeComment);

module.exports = router;
