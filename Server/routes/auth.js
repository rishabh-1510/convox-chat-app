const express = require("express");
const {
  sendOtp,
  signup,
  login,
  logout,
} = require("../controllers/auth");
const { auth } = require("../middlwares/auth");

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", auth, logout);

module.exports = router;
