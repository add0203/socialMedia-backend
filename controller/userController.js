// const AsyncHandler = require("express-async-handler");
// const { generateToken } = require("../helper/jwtToken");

const email_validator = require("email-validator");
const USERMODEL = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../helper/jwtToken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  try {
    let { name, email, password, profile_pic } = req.body;
    // console.log(req.body);
    if (
      !name ||
      !email ||
      !password ||
      !email_validator.validate(email)
      // ||
      // !profile_pic
      // ||
      // !password.length >= 6
    ) {
      res.status(400);
      res.send("feild is messing");
    }

    const userExists = await USERMODEL.findOne({ email: email });

    if (userExists) {
      res.status(400);
      res.send("User already exists");
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await USERMODEL.create({
      name,
      email,
      password: hashedPass,
      profile_pic,
      lastLogin: Date.now,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profile_pic: user.profile_pic,
        token: generateToken(user._id, user.name, req, res),
      });
    } else {
      res.status(400);
      res.send("User not found");
    }
  } catch (error) {
    res.send(error);
  }
};

exports.signIn = async (req, res) => {
  //retrieve data from req.body
  let { email, password } = req.body;

  //validation of data field in body
  if (
    !email ||
    !password ||
    !email_validator.validate(email) ||
    !password.length >= 6
  ) {
    console.log(password, email);
    res.status(401).send("feild is missing");
  } else {
    //checking presence of the user in  db
    const userExists = await USERMODEL.findOne({ email: email });

    //compaire the password with the hash password present in the db
    let compare = bcrypt.compareSync(password, userExists.password);

    if (userExists && compare) {
      // userExists.lastLogin = Date.now;
      console.log(userExists.lastLogin);
      const Token = generateToken(userExists._id, userExists.name, req, res);
      console.log(Token);
      userExists.token = Token; ////15-03-2023 done
      // let tokenUpdate = await USERMODEL.findByIdAndUpdate({ token: Token });
      await userExists.save();
      res.status(200).json({ userExists });
    } else {
      res.send("user doesn't Exist").status(400);
    }
  }
};

exports.searchUser = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  // console.log(keyword);
  const userExists = await USERMODEL.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  console.log(req.query.search);
  console.log("hi");
  res.send(userExists);
  // console.log(userExists);
};

exports.forgetPass = async (req, res) => {
  //retrieve data from req.body
  let { email } = req.body;

  //checking presence of the user in  db
  const userExists = await USERMODEL.findOne({ email: email });

  if (!userExists) {
    return res
      .status(404)
      .json({ mess: "Email does not exist", status: "error" });
    // res.send("user doesn't Exist").status(400);
  }

  const generatedToken = crypto.randomBytes(10);
  console.log(`genratedToken = ${generatedToken}`);

  if (!generatedToken) {
    return res.status(500).json({ mess: "try again later", status: "error" });
  }

  const tokenIntoHexString = generatedToken.toString("hex");
  console.log(` hexToken = ${tokenIntoHexString}`);

  userExists.resetToken = tokenIntoHexString;
  console.log(userExists.resetToken);

  userExists.expireToken = Date.now() + 3600000; //1 hr

  await userExists.save();

  var transporter = nodemailer.createTransport({
    service: "Gmail",
    secure: false,
    port: 587,
    auth: {
      user: "useranand7985@gmail.com",
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log(email);
  var mail = {
    to: email,
    from: "useranand7985@gmail.com",
    subject: "its reset password code",
    text:
      "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      // "http://" +
      //  +
      "/reset/\n" +
      tokenIntoHexString +
      "\n\n" +
      "If you did not request this, please ignore this email and your password will remain unchanged.\n",
  };

  transporter.sendMail(mail, () => {
    res.send("mail send");
  });

  res.header("id", userExists._id);
  //  res.header("key", token).status(200);

  userExists.lastLogin = Date.now();
};

exports.checkOtp = async (req, res) => {
  let userCheck = USERMODEL.findOne({
    resetToken: req.body.otp,
    expireToken: { $gt: Date.now() },
  });

  if (!userCheck) {
    res.send("opt is incorrect or time excieded");
  } else {
    userCheck.expireToken = Date.now() + 3600000;
    res.send("otp checked");
  }
};

exports.resetPass = async (req, res) => {
  //retrieve data from req.body
  let { newPass, confirmPass } = req.body;

  console.log(req.body);
  // console.log(req.params.id);

  //compair the resetToken from user input and stored in user Schema
  let user = await USERMODEL.findOne({
    resetToken: req.body.otp,
    expireToken: { $gt: Date.now() },
  });

  // console.log(user);
  if (!user) {
    return res
      .status(400)
      .json({ mess: "token not existed or invalid", status: "error" });
  }

  // res.send(user);
  console.log(user);
  console.log(newPass);
  console.log(confirmPass);
  //16-03-2023
  if (newPass && confirmPass && newPass === confirmPass && newPass >= 8) {
    const hashedPass = await bcrypt.hash(newPass, 10);
    let passUpdated = await USERMODEL.findByIdAndUpdate(
      { resetToken: req.body.otp },
      { password: newPass }
    );
    res.send("Password Update");
    if (!passUpdated) {
      res.send(passUpdated);
    }
  } else {
    res.send("not updated").status(500);
  }
};

exports.deleteUser = async (req, res) => {
  //retrieve data from req.params
  try {
    const { id: userID } = req.body;
    const user = await USERMODEL.findByIdAndRemove({ _id: userID });
    if (!user) {
      return res.status(400).json({ success: false, mess: "invalid ID" });
    } else {
      return res.status(200).json({ success: true, mess: "user Deleted" });
    }
  } catch (error) {
    res.status(400).json({ success: false, mess: "not" });
  }
};

exports.userList = async (req, res) => {
  try {
    const users = await USERMODEL.find({});
    if (!users) {
      return res.status(400).json({ mess: "No user find" });
    } else {
      return res.status(200).json({ users });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};
exports.userListById = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const user = await USERMODEL.findById({ _id: id });
    if (!user) {
      return res.status(400).json({ mess: "No user find" });
    } else {
      return res.status(200).json({ user });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id: userID } = req.params;
    const userExists = USERMODEL.findByIdAndUpdate({ _id: userID }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!userExists) {
      return res.status(400).json({
        mess: "user not Exist",
      });
    } else {
      userExists.name = req.body.newName;
      userExists.email = req.body.newEmail;
      await userExists.save();
      return res.status(200).json({
        mess: "user Updated",
      });
    }
  } catch (error) {
    res.status(200).json({ error });
  }
};

exports.follow = async (req, res) => {};

const Location = require("../models/geolocationModel"); // Import the defined schema
const geolib = require("geolib"); // Import the geolib library

// const center = { latitude: 37.7749, longitude: -122.4194 };
// const radius = 10000;

exports.nearBySearch = async (req, res) => {
  const { latitude, longitude } = req.body;
  const center = { latitude, longitude };
  const { radius } = req.body;

  Location.find()
    .then((locations) => {
      const nearbyLocations = locations.filter((location) => {
        const distance = geolib.getDistance(center, {
          latitude: location.latitude,
          longitude: location.longitude,
        });
        return distance <= radius;
      });
      console.log("Nearby locations:", nearbyLocations);
    })
    .catch((error) => {
      console.error("Error querying locations:", error);
    });
};

// exports.signIn = AsyncHandler(async (req, res) => {
//   let { email, password } = req.body;
//   // let { token } = req.params;

//   if (!email || !password) {
//     res.status(400);
//     res.send("field is messing");
//   }

//   const userExists = await USERMODEL.findOne({ email: email });
//   const pass = bcrypt.compare(password, userExists.password);
//   if (!userExists) {
//     res.status(400);
//     res.send("User already Exist");
//   } else {
//     if (userExists && pass) {
//       userExists.lastLogin = Date.now();

//       const JWT_SECRET = "group_project";

//       // const genToken = jwt.sign(
//       //   {
//       //     userId: userExists._id,
//       //   },
//       //   JWT_SECRET,
//       //   { expiresIN: "1d" }
//       // );
//       // console.log(Date.now());
//       await userExists.save();
//       res.status(201).json({
//         _id: userExists._id,
//         name: userExists.name,
//         email: userExists.email,
//         token: genToken,
//       });
//     } else {
//       res.send("user not varified || wrong credential").status(400);
//     }
//   }
// });
