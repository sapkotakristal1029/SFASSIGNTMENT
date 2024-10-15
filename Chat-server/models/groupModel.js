// models/groupModel.js

const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Group Admins
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
