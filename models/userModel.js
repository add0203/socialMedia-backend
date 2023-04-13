const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: "String" },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    token: "String",
    resetToken: "String",
    expireToken: "String",
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
      },
    ],

    profile_pic: {
      type: String,
      required: [true, "Please provide Image"],
    },
    // comments_List: [
    //   {
    //     type: mongoose.Types.ObjectId,
    //     ref: "Comment",
    //   },
    // ],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    location: [{ type: mongoose.Schema.Types.ObjectId, ref: "Location" }],
  },
  { lastLogin: { type: Date } }
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     const salt = await bcrypt.genSalt(9);

//     this.password = await bcrypt.hash(this.password, salt);
//   }
// });

let USERMODEL = mongoose.model("users", userSchema);
module.exports = USERMODEL;

//   pic: {
//       type: "String",
//       required: true,
//       default:
//         "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
//     },
//     isAdmin: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
