const { body, validationResult } = require("express-validator");

const {
  validateImg,
  convertImgAndUploadToFirebase,
  deleteImageFromUrl,
} = require("../utils/imgs");
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
    // Proceed with validate image if we attached one with the post
    if (req.file !== undefined) validateImg(req.file, errors.errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Something is wrong with your input.",
        errors: errors.array(),
      });
    }

    // "downloadUrl" will be the url to firebase image if image was attached & uploaded
    let downloadUrl = "";
    if (req.file) {
      try {
        downloadUrl = await convertImgAndUploadToFirebase(req.file, req.userId);
      } catch (err) {
        return res.status(500).json({
          message: "An error has occurred when uploading post image.",
        });
      }
    }

    const postBody = {
      author: req.userId,
      content: req.body.content,
      timestamp: Date.now(),
      imgUrl: downloadUrl,
    };

    // Can now create post
    try {
      const newPost = await Post.create(postBody);
      return res.status(201).json({
        message: "Successfully created post.",
        post: newPost,
      });
    } catch (err) {
      console.log(err);
      // Delete image uploaded to firebase if it exists (was uploaded)
      if (downloadUrl) await deleteImageFromUrl(downloadUrl);

      return res.status(500).json({
        message: "Something went wrong when trying to create post.",
      });
    }
  },
];

// This will be a "post" page with the post and its comments
exports.getSinglePost = async (req, res, next) => {
  const populatedPost = await Post.findById(req.params.postId)
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
  // Check to see if we don't own the post
  if (!req.currentPost.author.equals(req.currentUser._id)) {
    return res.status(403).json({
      message: "You do not have access to that post.",
    });
  }

  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    // Delete image if it exists
    if (deletedPost.imgUrl) await deleteImageFromUrl(deletedPost.imgUrl);

    return res.status(200).json({ message: "Successfully deleted post." });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong when trying to delete post.",
    });
  }
};

exports.likePost = async (req, res, next) => {
  const { postId } = req.params;
  const currUserId = req.currentUser._id;

  try {
    if (req.currentPost.likes.includes(currUserId)) {
      // Remove like from post
      await Post.findByIdAndUpdate(postId, { $pull: { likes: currUserId } });
      return res.status(200).json({ message: "Successfully unliked post." });
    } else {
      // Add like to post
      await Post.findByIdAndUpdate(postId, {
        $addToSet: { likes: currUserId },
      });
      return res.status(200).json({ message: "Successfully liked post." });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong when trying to like/unlike post.",
    });
  }
};
