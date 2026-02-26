const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const MessageSchema = new Schema(
  {
    text: { type: String },
    file: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
);

const MessageModel = model("Message", MessageSchema);
module.exports = MessageModel;
