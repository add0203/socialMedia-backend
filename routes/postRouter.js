const express = require("express");

const {
  createPost,
  getAllPost,
  like,
  getPost,
  comment,
  getLike,
  commentReply,
} = require("../controller/postController");
const { uploadPostImage } = require("../controller/uploadImageController");

let postRouter = express.Router();
postRouter.route("/").get(getAllPost).post(createPost);
postRouter.route("/like").put(like).get(getLike);
postRouter.route("/comment").put(comment);
postRouter.route("/commentreplies").put(commentReply);
postRouter.route("/getPost").get(getPost);

postRouter.route("/uploadimage").post(uploadPostImage);

module.exports = postRouter;
