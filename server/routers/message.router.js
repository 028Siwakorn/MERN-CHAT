const express = require("express")
const router = express.Router()
const { getUsersForSidebar, sendMessage, getMessage } = require("../controllers/message.controller")
const { protectedRoute } = require("../middlewares/auth.middleware")

router.get("/users", protectedRoute, getUsersForSidebar)
router.get("/:id", protectedRoute, getMessage)
router.post("/send/:id", protectedRoute, sendMessage)

module.exports = router