const Message = require("../models/Message")
const User = require("../models/User")
const cloudinary = require("../configs/cloudinary")
const { getReceiverSocketId, io } = require("../lib/socket")

const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        res.status(200).json(filteredUsers)
    } catch (err) {
        console.log("Error in getUsersForSidebar", err)
        res.status(500).json({ message: "Internal server error while getting users info" })
    }
}

const getMessage = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChat } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: myId, recipientId: userToChat },
                { senderId: userToChat, recipientId: myId }
            ]
        })
        res.json(messages)
    } catch (error) {
        res.status(500).json({ message: "Internal server error while getting messages" })
    }
}

const sendMessage = async (req, res) => {
    try {
        const { id: recipient } = req.params;
        if (!recipient) {
            return res.status(400).json({ message: "Recipient not found" })
        }
        const senderId = req.user._id;
        const { text, file } = req.body;
        let fileUrl = ""
        if (file) {
            const uploadResponse = await cloudinary.uploader.upload(file)
            fileUrl = uploadResponse.secure_url
        }
        const newMessage = await new Message({
            senderId: senderId,
            recipientId: recipient,
            text: text,
            file: fileUrl
        })
        await newMessage.save();
        res.json({ message: newMessage });
    } catch (error) {
        res.status(500).json({ message: "Internal server error while sending message" })
    }
}
const messageController = {
    getUsersForSidebar,
    getMessage,
    sendMessage
}

module.exports = messageController