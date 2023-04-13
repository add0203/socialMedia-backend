const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    postname: {
      type: String,
      required: [true, "Please provide Post name"],
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    discription: {
      type: String,
      required: [true, "Please provide discription"],
      maxlength: 50,
    },
    comments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },

    img: {
      type: String,
      required: [true, "Please provide Image"],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        unique: true,
      },
    ],
    tags: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSchema",
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", postSchema);
