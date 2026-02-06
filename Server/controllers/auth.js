const bcrypt = require("bcryptjs");
const User = require("../models/User");
const OTP = require("../models/Otp");
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator");

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    //  Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    //  Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    //  Delete previous OTPs for this email
    await OTP.deleteMany({ email });

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    //  Save OTP (email is sent via pre-save hook)
    await OTP.create({
      email,
      otp,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// SIGNUP CONTROLLER
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, otp } = req.body;

    if (!firstName || !lastName || !email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const otpDoc = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }
    console.log(otpDoc);

    const isOtpValid = await bcrypt.compare(otp, otpDoc.otp);
    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    const hashedPassword = await bcrypt.hash(password,10);  

    const user = await User.create({
      firstName,
      lastName,
      email,
      password:hashedPassword,
      avatar:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    await OTP.deleteMany({ email });
    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    //  Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    //  Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    //  Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    //  Update online status (optional but good)
    user.isOnline = true;
    await user.save();

    // Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    // req.user is set by auth middleware (JWT)
    const userId = req.user.id;

    //  Mark user offline
    await User.findByIdAndUpdate(userId, {
      isOnline: false,
    });

    //  Send response
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
