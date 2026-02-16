const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    fullname: { type: String, required: true, minlength: 4 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    profilePicture: { type: String, default: "" },
    // Settings: theme preference (e.g. "sechat", "cyberpunk", "light", "dark")
    theme: { type: String, default: "sechat" },
    // Profile: account status
    status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
    // Friends: array of user IDs (mutual friendship)
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const UserModel = model("User", UserSchema);
module.exports = UserModel;
