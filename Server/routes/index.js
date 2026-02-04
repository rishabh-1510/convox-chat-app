const express = require("express");

const authRoutes = require("./auth");
const chatRoutes = require("./chat");
const messageRoutes = require("./message");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/message", messageRoutes);

module.exports = router;
