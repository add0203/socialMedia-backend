const express = require("express");
const userRoutes = require("./routes/userRoute");
const chatRoutes = require("./routes/chatRoute");
const postRoutes = require("./routes/postRouter");
const bodyparser = require("body-parser");
const { protect } = require("../backend/helper/jwtToken");

require("dotenv").config();
require("express-async-errors");
const mongoose = require("mongoose");

const app = express();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//middleware
app.use(express.static("./image/upload"));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
// app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({ extended: true }));

//routes

app.use("/user", userRoutes);
app.use("/post", protect, postRoutes);
app.use("/chat", chatRoutes);
// app.use("/api/user", userRoutes);

//DB
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DB_LINK, {
    // useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "projectX",
  })
  .then(() => {
    console.log("DB is READY");
  })
  .catch((err) => {
    console.log(err);
  });

//server

app.listen(process.env.PORT, () => {
  console.log(`server is running at http://localhost:${process.env.PORT}`);
});
