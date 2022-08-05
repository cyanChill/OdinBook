const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

/* 
  ***********************************************************
                      For "/users" Routes
  ***********************************************************
*/
// Checks if :userId param is for a valid user
exports.validUserId = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User does not exist." });
    return next();
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong while verifying the userId.",
    });
  }
};

// Checks if current user is a "friend" of :userId user (assuming :userId user
// exists) or is the user with :userId
exports.isFriendOrOwner = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.userId,
      friends: req.userId,
    });
    if (req.userId === req.params.userId) req.isOwner = true;
    else req.isOwner = false;

    if (user || req.userId === req.params.userId) req.isFriendOrOwner = true;
    else req.isFriendOrOwner = false;
    return next();
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong while verifying the userId.",
    });
  }
};

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
// Return a "User" object from reading req.userId
exports.getCurrentUser = async (req, res, next) => {
  try {
    const currUser = await User.findById(req.userId);
    if (!currUser) {
      return res.status(404).json({ message: "User does not exist." });
    }
    req.currentUser = currUser;
    return next();
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong on the server.",
    });
  }
};

// Checks if :postId param is for a valid post & set req.currPost to the "Post" object
exports.validPostId = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post does not exist." });
    req.currentPost = post;
    return next();
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong while verifying the postId.",
    });
  }
};

// Checks to see if current user has access to post
exports.hasPostAccess = async (req, res, next) => {
  const { currentPost, currentUser } = req;
  // Check to see if we're not friends with the post owner or not the post owner
  if (
    !currentUser.friends.includes(currentPost.author) &&
    !currentPost.author.equals(currentUser._id)
  ) {
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
// Checks if :commentId param is for a valid comment & set req.currComment to the "Comment" object
exports.validCommentId = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist." });
    }
    req.currentComment = comment;
    return next();
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong while verifying the commentId.",
    });
  }
};

/* 
  ***********************************************************
              For "/user/:userId/friends" Routes
  ***********************************************************
*/
// Checks relation status between current user & user they're viewing
//  - Sets req.hasSentRequest & req.isFriend
exports.checkUserRelationStatus = async (req, res, next) => {
  try {
    // Get basic info on user they're currently viewing
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist." });
    }
    req.hasSentRequest = user.friendRequests.includes(req.userId);
    req.isFriend = user.friends.includes(req.userId);
    return next();
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong while checking relation status.",
    });
  }
};
