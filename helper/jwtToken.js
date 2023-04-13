const JWT = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");
const USERMODEL = require("../models/userModel");
exports.generateToken = (userId, req, res) => {
  try {
    let token = JWT.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    if (!token) {
      res.send("token genration failed").status(400);
    }

    // res.header("key", token).status(200);
    return token;
  } catch (error) {
    res.send(error);
  }
};

// exports.protect = asyncHandler(async (req, res, next) => {
//   let token;
//   if (
//     req.header.authorization &&
//     req.header.authorization.startaWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

//       //decode token
//       const decode = JWT.verify(token, process.env.JWT_SECRET);

//       req.user = await USERMODEL.findById(decode).select("-password");
//       // res.header("userId", decode._id).status(200);
//       next();
//     } catch (error) {
//       res.status(401);
//       throw new error("not auth");
//     }
//   }

//   if (!token) {
//     res.status(401).json({ mess: "token not found" });
//     // throw new error("not auth NO TOKEN");
//   }
// });

exports.protect = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(400).json({
      message: "auth invalid",
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    res.status(400).json({
      message: `auth invalid ${error}`,
    });
  }
};
