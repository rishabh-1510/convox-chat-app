const express = require("express");
const router = express.Router();

const {
  getMe,
  searchUsers,
  updateProfile,
  getAllUsers,
} = require("../controllers/user");

const { auth } = require("../middlwares/auth");

// Get logged-in user
router.get("/me", auth, getMe);

// Search users
router.get("/search", auth, searchUsers);

// Update profile
router.put("/update", auth, updateProfile);

router.get('/getAllUsers',auth,getAllUsers);

module.exports = router; 
