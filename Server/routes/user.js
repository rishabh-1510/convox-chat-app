const express = require("express");
const router = express.Router();

const {
  getMe,
  searchUsers,
  updateProfile,
} = require("../controllers/user");

const { auth } = require("../middlwares/auth");

// Get logged-in user
router.get("/me", auth, getMe);

// Search users
router.get("/search", auth, searchUsers);

// Update profile
router.put("/update", auth, updateProfile);

module.exports = router; 
