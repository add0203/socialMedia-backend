const mongoose = require("mongoose");

const messSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "chats" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", messSchema);
