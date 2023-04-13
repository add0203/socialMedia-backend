const express = require("express");
const Router = express.Router();
const protect = require("../helper/jwtToken");

// Router.route("/").post(protect, accessChat);
// Router.route('/').get(protect,fetchChat)
// Router.route('/group').post(protect,createGroupChat)
// Router.route('/rename').put(protect,remaneGroup)
// Router.route('/groupremove').put(protect,removeFromGroup)
// Router.route('/geoupadd').put(protect,addToGroup)

module.exports = Router;
