// models/userModel.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
      type: [String],
      enum: ["Super Admin", "Group Admin", "User"], // Enum for roles
      default: ["User"],
    },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    profileImage: { type: String }, // For avatar image (Phase 2)
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
