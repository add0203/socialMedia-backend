const Post = require("../models/postModel");
// const Like = require("../models/likesModel");
const Comment = require("../models/commentModel");
const USERMODEL = require("../models/userModel");

exports.createPost = async (req, res) => {
  // console.log(req.body);
  // res.status(200).json({ post });
  //11-04-2023
  try {
    const { userId } = req.body;
    const user = await USERMODEL.findById({
      _id: userId,
    });
    if (!user) {
      res.send("not user exist");
    }
    //11-04-2023
    const post = await Post.create(req.body);
    const postUpdate = await USERMODEL.findByIdAndUpdate(
      { _id: userId },
      {
        $push: { posts: post._id },
      }
    );
    console.log("post update runed");
    if (!postUpdate) {
      res.status(500).json({ message: "post not updated to user" });
    }
    res.status(200).json({ post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "post not created" });
  }
};

exports.getAllPost = async (req, res) => {
  const post = await Post.find({})
    .populate("likes", "-password")
    .populate("comments", "-password");
  res.send(post);
};
exports.getPost = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    // const user = await Post.findById({ _id: req.params.id }).populate("users");
    const user = await Post.findById({ _id: id }).populate("users");
    if (!user) {
      return res.status(400).json({ mess: "No Post find" });
    } else {
      return res.status(200).json({ user });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

//12 - 04 - 2023
exports.getLike = async (req, res) => {
  let { postId } = req.body;

  const post = Post.findById({ _id: postId });
  res.status(200).json({ post: post });
};

exports.like = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    console.log(req.user);
    const user = await USERMODEL.findById({
      _id: userId,
    });
    if (!user) {
      res.send("not user exist");
    }
    const post = await Post.findById({
      _id: postId,
    });
    if (!post) {
      return res.send("not post exist");
    }

    Post.findOne({ _id: post._id }, (err, doc) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          message: err,
        });
      }

      console.log(
        `inside postlike callback function ${doc.likes.includes(user._id)}`
      );
      if (doc && doc.likes.includes(user._id)) {
        Post.updateOne(
          { _id: post._id },
          { $pull: { likes: user._id } },
          (err, result) => {
            if (err) {
              console.error(err);
              res.status(400).json({
                message: err,
              });
            } else {
              console.log(`User ID ${user.name} removed from 'likes' array.`);
              res.status(200).json({
                message: `User ID ${user.name} removed to 'likes' array.`,
              });
            }
          }
        );
      } else {
        Post.updateOne(
          { _id: post._id },
          { $addToSet: { likes: user._id } },
          (err, result) => {
            if (err) {
              console.error(err);
              res.status(400).json({
                message: err,
              });
            } else {
              console.log(`User ID ${user.name} added to 'likes' array.`);
              res.status(200).json({
                message: `User ID ${user.name} added to 'likes' array.`,
              });
            }
          }
        );
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.commentReply = async (req, res) => {
  try {
    const { commentText, commentId, postId, userId } = req.body;
    const post = await Post.findById({ _id: postId });
    if (!post) {
      res.status(400).json({
        message: `no post find on postid`,
      });
    }
    const commentExist = await Comment.findById({ _id: commentId });
    if (!commentExist) {
      res.status(400).json({
        message: `no post find on commentId`,
      });
    }

    // const commentRep = await Comment.updateOne({
    //   content:
    //   author: userId,
    // });

    Comment.updateOne(
      { _id: commentExist._id },
      // { $addToSet: { replies.parentCommentId : comment}, {replies.contentCon :} },
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(400).json({
            message: err,
          });
        } else {
          res.status(200).json({
            message: `User ID ${user.name} added to 'commenet' array.`,
          });
        }
      }
    );

    if (!commentRep) {
      res.status(400).json({
        message: `no comment created`,
      });
    }

    Post.findByIdAndUpdate(
      { _id: post._id },
      { $addToSet: { replies: commentRep._id } },
      (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`post name : ${post.postname} > added new Comment.`);
          res.status(200).json({
            message: `post name : ${post.postname} > added new Comment and reply comment ID id ${commentRep._id}`,
          });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// exports.comment = async (req, res) => {
//   try {
//     const { commentText, postId, userId } = req.body;

//     const post = await Post.findById({ _id: postId });
//     if (!post) {
//       res.status(400).json({
//         message: `no post find on postid`,
//       });
//     }

//     const comment = await Comment.create({
//       content: commentText,
//       author: userId,
//     });

//     if (!comment) {
//       res.status(400).json({
//         message: `no comment created`,
//       });
//     }

exports.comment = async (req, res) => {
  try {
    const { commentText, postId, userId } = req.body;

    const post = await Post.findById({ _id: postId });
    if (!post) {
      res.status(400).json({
        message: `no post find on postid`,
      });
    }

    const comment = await Comment.create({
      content: commentText,
      author: userId,
    });

    if (!comment) {
      res.status(400).json({
        message: `no comment created`,
      });
    }

    Post.findByIdAndUpdate(
      { _id: post._id },
      { $addToSet: { comments: comment._id } },
      (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`post name : ${post.postname} > added new Comment.`);
          res.status(200).json({
            message: `post name : ${post.postname} > added new Comment. & comment id is ${comment._id}`,
          });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// exports.like = async (req, res) => {
//   try {
//     const { userId, postId } = req.body.user;

//     const existingLike = await Post.findByIdAndUpdate({
//       post: postId,
//     },{
//       $addToSet : {likes: userId}
//     });

//     if (existingLike) {
//       return res
//         .status(400)
//         .json({ message: "You have already liked this post." });
//     }

//     // const newLike = await Like.findByIdAndUpdate(
//     //   {
//     //     post: postId,
//     //   },
//     //   {
//     //     user: authenticatedUserId,
//     //     post: postId,
//     //   },
//     //   {
//     //     new: true,
//     //     runValidators: true,
//     //   }
//     // );
//     // const newLike = await Post.updateOne({
//     //   likes: userId,
//     // });
//     // await newLike.save();
//     res.status(201).json({ message: "Like created successfully." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

// try {
//   const likeCheck = await Post.findByIdAndUpdate(
//     { _id: post._id },
//     {
//       $set: { likes: user._id },
//     }
//   );
//   console.log("likecheck try block");
//   if (!likeCheck) {
//     console.log("likeCheck done");
//     return res.status(404).json({ mess: "unliked it", status: "Done" });
//     // res.send("user doesn't Exist").status(400);
//   }
//   await likeCheck.save();
// } catch (error) {
//   console.log(error);
// }

// const postLike = await Post.findByIdAndUpdate(
//   { _id: post._id, likes: { $ne: user._id } },
//   // { $set: { likes: user._id } },
//   {
//     $addToSet: { likes: user._id },
//   },
//   {
//     new: true,
//     runValidators: true,
//   }
// )
//   .then((updatedDocument) => {
//     if (updatedDocument) {
//       console.log("Document updated successfully:", updatedDocument);
//     } else {
//       console.log(
//         "Element already present in the array. No update performed."
//       );
//     }
//   })
//   .catch((error) => {
//     console.error("Error updating document:", error);
//   });
// // await postLike.save();
