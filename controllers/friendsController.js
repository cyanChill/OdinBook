const User = require("../models/User");

exports.getFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId, "friends").populate(
      "friends",
      "first_name last_name profilePicUrl"
    );
    return res.status(200).json({
      message: "Successfully obtained friends.",
      friends: user.friends,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong when trying to get friends.",
    });
  }
};

exports.getFriendRequests = async (req, res, next) => {
  try {
    const user = await User.findById(
      req.params.userId,
      "friendRequests"
    ).populate("friendRequests", "first_name last_name profilePicUrl");
    return res.status(200).json({
      message: "Successfully obtained friend requests.",
      friendRequests: user.friendRequests,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong when trying to get friend requests.",
    });
  }
};

exports.toggleFriendRequest = async (req, res, next) => {
  if (req.isFriend) {
    return res.status(409).json({
      message:
        "Cannot send a friend request when you're already friends with the user.",
    });
  }

  if (req.isOwner) {
    return res.status(409).json({
      message: "Cannot send a friend request to yourself.",
    });
  }

  try {
    if (req.hasSentRequest) {
      // Withdraw friend request
      await User.findByIdAndUpdate(req.params.userId, {
        $pull: { friendRequests: req.userId },
      });
      return res.status(200).json({
        message: "Succesfully withdrawn friend request.",
      });
    } else {
      // Check to see if we have a friend request from that user, if we
      // do, we add them as a friend
      const currUser = await User.findById(req.userId, "friendRequests");

      if (currUser.friendRequests.include(req.params.userId)) {
        // Add user
        await Promise.all([
          // Add current user to :userId's friend list
          User.findByIdAndUpdate(req.params.userId, {
            $addToSet: { friends: req.userId },
          }),
          // Add :userId to current user's friend list
          User.findByIdAndUpdate(req.userId, {
            $addToSet: { friends: req.params.userId },
          }),
          // Remove friend request from current user
          User.findByIdAndUpdate(req.userId, {
            $pull: { friendRequests: req.params.userId },
          }),
        ]);
        return res.status(200).json({ message: "Succesfully add friend." });
      } else {
        // Send friend request
        await User.findByIdAndUpdate(req.params.userId, {
          $addToSet: { friendRequests: req.userId },
        });
        return res.status(200).json({
          message: "Succesfully sent friend request.",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      message:
        "Something went wrong when trying to sent/withdraw friend request.",
    });
  }
};

exports.handleFriendRequest = async (req, res, next) => {
  const { requesterId } = req.params;
  const { action } = req.body;

  if (action !== "accept" && action !== "reject") {
    return res.status(406).json({ message: "Invalid action." });
  }

  // Validate :requesterId
  try {
    const user = await User.findById(requesterId);
    if (!user)
      return res.status(404).json({ message: "Request does not exist." });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong when trying to verify user.",
    });
  }

  try {
    if (action === "accept") {
      await Promise.all([
        // Add current user to :requesterId's friend list
        User.findByIdAndUpdate(requesterId, {
          $addToSet: { friends: req.userId },
        }),
        // Add :requesterId to current user's friend list
        User.findByIdAndUpdate(req.userId, {
          $addToSet: { friends: requesterId },
        }),
        // Remove friend request from current user
        User.findByIdAndUpdate(req.userId, {
          $pull: { friendRequests: requesterId },
        }),
      ]);
      return res.status(200).json({ message: "Succesfully add friend." });
    } else {
      // Reject friend request
      await User.findByIdAndUpdate(req.userId, {
        $pull: { friendRequests: requesterId },
      });
      return res.status(200).json({
        message: "Succesfully rejected friend request.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message:
        "Something went wrong when trying to accept/reject friend request.",
    });
  }
};

exports.removeFriend = async (req, res, next) => {
  const { friendId } = req.params;
  // Validate :friendId
  try {
    const user = await User.findById(friendId);
    if (!user)
      return res.status(404).json({ message: "Friend does not exist." });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong when trying to verify user.",
    });
  }

  // Delete friend
  try {
    await Promise.all([
      // Remove current user from :friendId's friend list
      User.findByIdAndUpdate(friendId, { $pull: { friends: req.userId } }),
      // Remove :friendId from current user's friend list
      User.findByIdAndUpdate(req.userId, { $pull: { friends: friendId } }),
    ]);
    return res.status(200).json({ message: "Succesfully removed friend." });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong when trying to remove friend.",
    });
  }
};
