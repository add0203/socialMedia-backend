// const mongoose = require("mongoose");

// const commentSchema = new mongoose.Schema(
//   {
//     allComments: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "users",
//         },
//         comment: String,
//         replies: [
//           {
//             userId: {
//               type: mongoose.Schema.Types.ObjectId,
//               ref: "users",
//             },
//             comment: String,
//             parentCommentId: {
//               type: mongoose.Schema.Types.ObjectId,
//               ref: "Comment",
//             },
//           },
//         ],
//       },
//     ],

//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Comment", commentSchema);
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
