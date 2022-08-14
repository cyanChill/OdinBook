const debug = require("debug")("middleware");

const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

/* 
  ***********************************************************
                      For "/users" Routes
  ***********************************************************
*/
// Checks if :userId param is for a valid user & sets req.currentUser
exports.validUserId = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User does not exist." });
    req.currentUser = user;
    return next();
  } catch (err) {
    debug(err);
    return res.status(500).json({
      message: "Something went wrong while verifying the userId.",
    });
  }
};

// Gets all relations with :userId
exports.getRelations = async (req, res, next) => {
  req.isOwner = req.userId === req.params.userId;
  req.isFriend = req.currentUser.friends.includes(req.userId);
  req.hasSentRequest = req.currentUser.friendRequests.includes(req.userId);
  req.isFriendOrOwner = req.isFriend || req.isOwner;

  return next();
};

/* 
  ***********************************************************
              For "/users/:userId/friends" Routes
  ***********************************************************
*/
// Checks if userId of accessor of route is equal to :userId of route
exports.isProfileOwner = async (req, res, next) => {
  if (req.isOwner) return next();
  return res.status(403).json({
    message: "User cannot modify profile of a different user.",
  });
};

/* 
  ***********************************************************
                      For "/posts" Routes
  ***********************************************************
*/
//Sets req.viewingUser from reading req.userId
exports.getViewingUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User does not exist." });
    req.viewingUser = user;
    return next();
  } catch (err) {
    debug(err);
    return res.status(500).json({
      message: "Something went wrong on the server.",
    });
  }
};

// Checks if :postId param is for a valid post & set req.currentPost to the "Post" object
exports.validPostId = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post does not exist." });
    req.currentPost = post;
    return next();
  } catch (err) {
    debug(err);
    return res.status(500).json({
      message: "Something went wrong while verifying the postId.",
    });
  }
};

// Checks to see if current user has access to post
exports.hasPostAccess = async (req, res, next) => {
  const { currentPost, viewingUser } = req;
  // Check to see if we're not friends with the post author and not the author
  if (
    !viewingUser.friends.includes(currentPost.author) &&
    !currentPost.author.equals(viewingUser._id)
  ) {
    debug(err);
    return res.status(403).json({
      message: "You do not have access to that post.",
    });
  }
  return next();
};

/* 
  ***********************************************************
              For "/posts/:postId/comments" Routes
  ***********************************************************
*/
// Checks if :commentId param is for a valid comment & set req.currentComment to the "Comment" object
exports.validCommentId = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist." });
    }
    req.currentComment = comment;
    return next();
  } catch (err) {
    debug(err);
    return res.status(500).json({
      message: "Something went wrong while verifying the commentId.",
    });
  }
};
