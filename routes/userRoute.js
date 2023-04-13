let express = require("express");
let { protect } = require("../helper/jwtToken");

const {
  register,
  signIn,
  forgetPass,
  resetPass,
  checkOtp,
  deleteUser,
  userList,
  userListById,
  updateUser,
  searchUser,
} = require("../controller/userController");

let userRoutes = express.Router();

userRoutes.route("/register").post(register);
userRoutes.route("/signIn").post(signIn);
userRoutes.route("/genOtp").post(forgetPass);
userRoutes.route("/resetPass").put(resetPass);
userRoutes.route("/checkOtp").post(checkOtp);
userRoutes.route("/deleteUser").delete(deleteUser);
userRoutes.route("/").get(userList);
userRoutes.route("/:id").get(userListById);
userRoutes.route("/updateUser").patch(updateUser);
userRoutes.route("/searchUser").get(protect, searchUser);

module.exports = userRoutes;
