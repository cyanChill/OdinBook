const express = require("express");
const router = express.Router();

const commentsRouter = require("./comments");

const { upload } = require("../utils/imgs");
const routeMiddleware = require("../utils/routeMiddleware");
const postsController = require("../controllers/postsController");

// ⭐ Current Route: "/api/posts" ⭐

/* ❗ Middlewares ❗ */
// To get current user object in req.currentUser
router.use(routeMiddleware.getCurrentUser);

/* ❗ Routes ❗ */
// GET 10 posts at a time
router.get("/", postsController.getFeedPosts);
// POST route for creating a new post
router.post("/", upload.single("postImg"), postsController.createPost);

/* ❗ Middlewares ❗ */
// :postId parameter must link to a valid post
router.use("/:postId", routeMiddleware.validPostId);
// Checks to see if we have access to a post
router.use("/:postId", routeMiddleware.hasPostAccess);

/* ❗ Routes ❗ */
// GET data for single post
router.get("/:postId", postsController.getSinglePost);
// DELETE post
router.delete("/:postId", postsController.deletePost);

// PUT route for liking/unliking a post
router.put("/:postId/like", postsController.likePost);

// Route for handling comments
router.use("/:postId/comments", commentsRouter);

module.exports = router;
