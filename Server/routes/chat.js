const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  startChat
} = require("../controllers/chat");
const { auth } = require("../middlwares/auth");

const router = express.Router();

// personal chat
router.post("/", auth, accessChat);
router.get("/", auth, fetchChats);
router.post("/start", auth, startChat);
// group chat
router.post("/group", auth, createGroupChat);
router.put("/rename", auth, renameGroup);
router.put("/add", auth, addToGroup);
router.put("/remove", auth, removeFromGroup);

module.exports = router;
 