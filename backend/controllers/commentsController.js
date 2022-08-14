const { body, validationResult } = require("express-validator");
const debug = require("debug")("commentsController");

const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.postComment = [
  body("comment", "Comment is required.").trim().isLength({ min: 1 }),

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
      const [popNewComment] = await Promise.all([
        Comment.findById(newComment._id).populate("user"),
        // Add comment to post
        Post.findByIdAndUpdate(req.params.postId, {
          $push: { comments: newComment._id },
        }),
      ]);

      res.status(201).json({
        message: "Successfully created comment.",
        comment: popNewComment,
      });
    } catch (err) {
      debug(err);
      return res.status(500).json({
        message: "Something went wrong when trying to create comment.",
      });
    }
  },
];

exports.deleteComment = async (req, res, next) => {
  // Check to see if we don't own the comment
  if (!req.currentComment.user.equals(req.viewingUser._id)) {
    return res.status(403).json({
      message: "You do not have access to that comment.",
    });
  }

  try {
    // Delete comment & reference to comment in Post it was in
    await Promise.all([
      Comment.findByIdAndDelete(req.params.commentId),
      Post.findByIdAndUpdate(req.currentComment.post, {
        $pull: { comments: req.params.commentId },
      }),
    ]);
    return res.status(200).json({ message: "Successfully deleted comment." });
  } catch (err) {
    debug(err);
    return res.status(500).json({
      message: "Something went wrong when trying to delete comment.",
    });
  }
};

exports.likeComment = async (req, res, next) => {
  const { commentId } = req.params;
  const userId = req.viewingUser._id;

  try {
    if (req.currentComment.likes.includes(userId)) {
      // Remove like from comment
      await Comment.findByIdAndUpdate(commentId, { $pull: { likes: userId } });
      return res.status(200).json({
        message: "Successfully unliked comment.",
        liked: false,
      });
    } else {
      // Add like to comment
      await Comment.findByIdAndUpdate(commentId, {
        $addToSet: { likes: userId },
      });
      return res.status(200).json({
        message: "Successfully liked comment.",
        liked: true,
      });
    }
  } catch (err) {
    debug(err);
    return res.status(500).json({
      message: "Something went wrong when trying to like/unlike comment.",
    });
  }
};
