const { readToken } = require("./jwt");
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
exports.isFriendOrOwner = [
  // Set req.userId to "id" value found in JWT token
  readToken,
  async (req, res, next) => {
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
  },
];

// Checks if userId of accessor of route is equal to :userId of route
exports.isProfileOwner = async (req, res, next) => {
  if (req.isOwner) return next();
  return res.status(403).json({
    message: "User cannot modify profile of a different user.",
  });
};
