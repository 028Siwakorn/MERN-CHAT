const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const FriendRequestSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Index for faster lookups
FriendRequestSchema.index({ from: 1, to: 1 });
FriendRequestSchema.index({ to: 1, status: 1 });

const FriendRequestModel = model("FriendRequest", FriendRequestSchema);
module.exports = FriendRequestModel;
