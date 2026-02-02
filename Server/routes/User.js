const express = require("express");
const Router = express.Router();

const{ signup ,sendOtp } = require("../controllers/auth");


//AUTHENTICATION ROUTES

Router.post("/signup",signup);
Router.post('/sendotp',sendOtp);

module.exports = Router;