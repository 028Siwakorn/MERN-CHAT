const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const friendController = require("../controllers/friend.controller");
const { protectedRoute } = require("../middlewares/auth.middleware");

// Auth
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

// Profile (protected)
router.get("/check", protectedRoute, userController.checkAuth);
router.put("/update-profile", protectedRoute, userController.updateProfile);
router.get("/profile/:userId", protectedRoute, userController.getProfile);

// Settings
router.put("/theme", protectedRoute, userController.updateTheme);

// Search users
router.get("/search", protectedRoute, userController.searchUsers);

// Friends
router.get("/friends", protectedRoute, friendController.getFriends);
router.get("/friends/check/:userId", protectedRoute, friendController.checkFriendship);
router.post("/friends/request", protectedRoute, friendController.sendFriendRequest);
router.put("/friends/request/:requestId/accept", protectedRoute, friendController.acceptFriendRequest);
router.put("/friends/request/:requestId/reject", protectedRoute, friendController.rejectFriendRequest);
router.delete("/friends/:friendId", protectedRoute, friendController.removeFriend);

module.exports = router;
