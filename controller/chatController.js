// const asyncHandler = require("express-async-handler");
// const Chat = require("../models/chatModel");

// exports.accessChat = async (req, res) => {
//   //take user id to whome we want to chat with
//   const { userId } = req.body;
//   //check wether userexist or not both req.user and req.body
//   if (!userId) {
//     console.log("UserId param not sent with request");
//     return res.status(400).json({ mess: "no userId found" });
//   }

//   var isChat = await Char.find({
//     $and: [
//       { users: { $elemMatch: { $eq: req.user._id } } },
//       { users: { $elemMatch: { $eq: userId } } },
//     ],
//   })
//     .populate("users", "-password")
//     .populate("latestMessage");
//   //
// };
