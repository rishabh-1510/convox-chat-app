const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60, // 5 minutes
  },
});

async function sendVerificationEmail(email, otp) {
  try {
    await mailSender(
      email,
      "OTP Verification from ConvoX",
      `Your OTP is <b>${otp}</b>. It will expire in 5 minutes.`
    );
  } catch (err) {
    console.log("Error while sending mail", err);
  }
}

// ✅ NO next PARAMETER
otpSchema.pre("save", async function () {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }

  if (this.isModified("otp")) {
    this.otp = await bcrypt.hash(this.otp, 10);
  }
});

module.exports = mongoose.model("OTP", otpSchema);
