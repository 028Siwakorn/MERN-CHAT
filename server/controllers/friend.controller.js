const UserModel = require("../models/User");
const FriendRequestModel = require("../models/FriendRequest");

/**
 * Send friend request (or add friend - auto-accepts if they already sent you one)
 * POST /api/v1/user/friends/request
 * Body: { targetUserId: string }
 */
exports.sendFriendRequest = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: "Target user ID is required" });
    }

    if (currentUserId.toString() === targetUserId) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
    }

    const targetUser = await UserModel.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await UserModel.findById(currentUserId);
    if (currentUser.friends.includes(targetUserId)) {
      return res
        .status(400)
        .json({ message: "Already friends with this user" });
    }

    let friendRequest = await FriendRequestModel.findOne({
      from: currentUserId,
      to: targetUserId,
      status: "pending",
    });

    if (friendRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Check if they sent us a request - auto accept
    const incomingRequest = await FriendRequestModel.findOne({
      from: targetUserId,
      to: currentUserId,
      status: "pending",
    });

    if (incomingRequest) {
      incomingRequest.status = "accepted";
      await incomingRequest.save();
      await UserModel.findByIdAndUpdate(currentUserId, {
        $addToSet: { friends: targetUserId },
      });
      await UserModel.findByIdAndUpdate(targetUserId, {
        $addToSet: { friends: currentUserId },
      });
      return res.status(200).json({
        message: "Friend request accepted! You are now friends.",
        status: "accepted",
      });
    }

    friendRequest = await FriendRequestModel.create({
      from: currentUserId,
      to: targetUserId,
    });

    res.status(201).json({
      message: "Friend request sent",
      friendRequest: {
        id: friendRequest._id,
        to: targetUserId,
        status: "pending",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error sending friend request",
    });
  }
};

/**
 * Accept friend request
 * PUT /api/v1/user/friends/request/:requestId/accept
 */
exports.acceptFriendRequest = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { requestId } = req.params;

    const friendRequest = await FriendRequestModel.findOne({
      _id: requestId,
      to: currentUserId,
      status: "pending",
    });

    if (!friendRequest) {
      return res
        .status(404)
        .json({ message: "Friend request not found or already processed" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await UserModel.findByIdAndUpdate(currentUserId, {
      $addToSet: { friends: friendRequest.from },
    });
    await UserModel.findByIdAndUpdate(friendRequest.from, {
      $addToSet: { friends: currentUserId },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error accepting friend request",
    });
  }
};

/**
 * Reject friend request
 * PUT /api/v1/user/friends/request/:requestId/reject
 */
exports.rejectFriendRequest = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { requestId } = req.params;

    const friendRequest = await FriendRequestModel.findOne({
      _id: requestId,
      to: currentUserId,
      status: "pending",
    });

    if (!friendRequest) {
      return res
        .status(404)
        .json({ message: "Friend request not found or already processed" });
    }

    friendRequest.status = "rejected";
    await friendRequest.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error rejecting friend request",
    });
  }
};

/**
 * Get friends list
 * GET /api/v1/user/friends
 */
exports.getFriends = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id)
      .populate("friends", "fullname email profilePicture")
      .lean();

    res.status(200).json(user.friends || []);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error fetching friends",
    });
  }
};

/**
 * Remove friend
 * DELETE /api/v1/user/friends/:friendId
 */
exports.removeFriend = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { friendId } = req.params;

    await UserModel.findByIdAndUpdate(currentUserId, {
      $pull: { friends: friendId },
    });
    await UserModel.findByIdAndUpdate(friendId, {
      $pull: { friends: currentUserId },
    });

    res.status(200).json({ message: "Friend removed" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error removing friend",
    });
  }
};

/**
 * Check if current user is friends with target user
 * GET /api/v1/user/friends/check/:userId
 */
exports.checkFriendship = async (req, res) => {
  try {
    const currentUser = await UserModel.findById(req.user._id);
    const isFriend = currentUser.friends.some(
      (id) => id.toString() === req.params.userId,
    );
    res.status(200).json({ isFriend });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error checking friendship",
    });
  }
};

/**
 * Get pending friend requests (received)
 * GET /api/v1/user/friends/requests
 */
exports.getFriendRequests = async (req, res) => {
  try {
    const requests = await FriendRequestModel.find({
      to: req.user._id,
      status: "pending",
    })
      .populate("from", "fullname email profilePicture")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error fetching friend requests",
    });
  }
};
