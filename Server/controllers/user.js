const User = require("../models/User");

// ======================================
// @desc    Get logged-in user profile
// @route   GET /api/v1/user/me
// @access  Protected
// ======================================
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
      
    });

  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

// ======================================
// @desc    Search users by name or email
// @route   GET /api/v1/user/search?query=
// @access  Protected
// ======================================
exports.searchUsers = async (req, res) => {
  try {
    const keyword = req.query.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const users = await User.find({
      $and: [
        {
          $or: [
            { firstName: { $regex: keyword, $options: "i" } },
            { lastName: { $regex: keyword, $options: "i" } },
            { email: { $regex: keyword, $options: "i" } },
          ],
        },
        { _id: { $ne: req.user.id } }, // exclude self
      ],
    }).select("-password");

    return res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {
    console.error("searchUsers error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search users",
    });
  }
};

// ======================================
// @desc    Update user profile (basic)
// @route   PUT /api/v1/user/update
// @access  Protected
// ======================================
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName } = req.body;

    const updateData = {};

    //  Optional text updates
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    //  Optional avatar upload
    if (req.files && req.files.avatar) {
      const displayPicture = req.files.avatar;

      const image = await imageUploader(
        displayPicture,
        process.env.FOLDER_NAME,
        300,
        300
      );

      updateData.avatar = image.secure_url; //  STRING ONLY
    }

    // 3️⃣ Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
