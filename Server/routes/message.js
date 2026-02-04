const express = require("express");
const {
  sendMessage,
  fetchMessages,
} = require("../controllers/message");
const { auth } = require("../middlwares/auth");

const router = express.Router();

router.post("/", auth, sendMessage);
router.get("/:chatId", auth, fetchMessages);

module.exports = router;
