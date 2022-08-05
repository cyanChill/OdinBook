const { body, validationResult } = require("express-validator");

const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.postComment = [
  body("comment", "Comment is required.").trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const commentBody = {
      post: req.params.postId,
      user: req.userId,
      comment: req.body.comment,
      timestamp: Date.now(),
    };

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Something is wrong with your input.",
        errors: errors.array(),
      });
    }

    // Can now create comment
    try {
      const newComment = await Comment.create(commentBody);
      // Add comment to post
      await Post.findByIdAndUpdate(req.params.postId, {
        $push: { comments: newComment._id },
      });
      res.status(201).json({
        message: "Successfully created comment.",
        comment: newComment,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong when trying to create comment.",
      });
    }
  },
];

exports.deleteComment = async (req, res, next) => {
  // Check to see if we don't own the comment
  if (!req.currentComment.user.equals(req.currentUser._id)) {
    return res.status(403).json({
      message: "You do not have access to that comment.",
    });
  }

  try {
    await Comment.findByIdAndDelete(req.params.commentId);
    return res.status(200).json({ message: "Successfully deleted comment." });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong when trying to delete comment.",
    });
  }
};

exports.likeComment = async (req, res, next) => {
  const { commentId } = req.params;
  const currUserId = req.currentUser._id;

  try {
    if (req.currentComment.likes.includes(currUserId)) {
      // Remove like from comment
      await Comment.findByIdAndUpdate(commentId, {
        $pull: { likes: currUserId },
      });
      return res.status(200).json({ message: "Successfully unliked comment." });
    } else {
      // Add like to comment
      await Comment.findByIdAndUpdate(commentId, {
        $push: { likes: currUserId },
      });
      return res.status(200).json({ message: "Successfully liked comment." });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong when trying to like/unlike comment.",
    });
  }
};
