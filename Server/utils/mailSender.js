const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // ✅ more reliable than custom host
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"ConvoX" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("EMAIL SENT:", info.response);

    return info;
  } catch (err) {
    console.error("MAIL ERROR FULL:", err); // ✅ full error

    //  VERY IMPORTANT
    throw err; // don't swallow error
  }
};

module.exports = mailSender;