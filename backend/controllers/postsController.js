const { body, validationResult } = require("express-validator");

const Post = require("../models/Post");

exports.getFeedPosts = async (req, res, next) => {
  const { since, skip } = req.query;
  try {
    // Get all of user's posts and friends posts
    const posts = await Post.find({
      author: [req.userId, ...req.currentUser.friends],
      timestamp: { $lt: since },
    })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(10);
    return res.status(200).json({
      message: "Successfully found posts.",
      posts: posts,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong on the server.",
    });
  }
};

exports.createPost = [
  body("content", "Content is required.").trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const { content } = req.body;

    const postBody = {
      author: req.userId,
      content: content,
      timestamp: Date.now(),
      imgUrl: "",
    };

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Something is wrong with your input",
        errors: errors.array(),
      });
    }

    // Can now create post
    try {
      const newPost = await Post.create(postBody);
      return res.status(201).json({
        message: "Successfully created post.",
        post: newPost,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong when trying to create post.",
      });
    }
  },
];

// This will be a "post" page with the post and its comments
exports.getSinglePost = async (req, res, next) => {
  const { postId } = req.params;
  const { currentPost, currentUser } = req;

  // Check to see if we're currently friend with the post owner
  if (
    !currentUser.friends.includes(currentPost.author) &&
    !currentPost.author.equals(currentUser._id)
  ) {
    return res.status(403).json({
      message: "You do not have access to that post.",
    });
  }

  const populatedPost = await Post.findById(postId)
    .populate("author")
    // Populate comment & its values
    .populate({
      path: "comments",
      model: "Comment",
      populate: { path: "user", model: "User" },
    });
  return res.status(200).json({
    message: "Successfully found post.",
    post: populatedPost,
  });
};

exports.deletePost = async (req, res, next) => {
  // Check to see if we own the post
  if (!req.currentPost.author.equals(req.currentUser._id)) {
    return res.status(403).json({
      message: "You do not have access to that post.",
    });
  }

  try {
    await Post.findByIdAndDelete(req.params.postId);
    return res.status(200).json({ message: "Successfully deleted post." });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong when trying to delete post.",
    });
  }
};

exports.likePost = async (req, res, next) => {
  const { postId } = req.params;
  const { currentPost, currentUser } = req;
  const currUserId = currentUser._id;

  // Check to see if we're currently friend with the post owner
  if (
    !currentUser.friends.includes(currentPost.author) &&
    !currentPost.author.equals(currUserId)
  ) {
    return res.status(403).json({
      message: "You do not have access to that post.",
    });
  }

  try {
    if (currentPost.likes.includes(currUserId)) {
      // Remove like from post
      await Post.findByIdAndUpdate(postId, { $pull: { likes: currUserId } });
      return res.status(200).json({ message: "Successfully unliked post." });
    } else {
      // Like from post
      await Post.findByIdAndUpdate(postId, { $push: { likes: currUserId } });
      return res.status(200).json({ message: "Successfully liked post." });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong when trying to like/unlike post.",
    });
  }
};
