const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.uploadPostImagelocal = async (req, res) => {
  // console.log(req.files);
  // res.send("post image");
  if (!req.files) {
    res.send("no image present");
  }
  const postImage = req.files.image;

  if (!postImage.mimetype.startsWith("image")) {
    res.send("please upload image formate");
  }

  const maxSize = 1024 * 1024; //1kb

  if (postImage.size > maxSize) {
    res.send("size should be less");
  }

  const imagePath = path.join(
    __dirname,
    "../image/upload/" + `${postImage.name}`
  );
  await postImage.mv(imagePath);
  // res.send("Upload post image");
  return res.status(200).json({ image: { src: `/${postImage.name}` } });
};

exports.uploadPostImage = async (req, res) => {
  console.log(req.files.image);

  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath, //create tetmp file
    {
      use_filename: true,
      folder: "groupProject",
    }
  );
  // res.send(result);
  fs.unlinkSync(req.files.image.tempFilePath);
  console.log("done");
  return res.status(200).json({ image: { src: `${result.secure_url}` } });
};
