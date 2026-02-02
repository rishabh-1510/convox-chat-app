
require("dotenv").config();
const mongoose = require("mongoose");

exports.Dbconnect = async () => {
  try {
    console.log(typeof(process.env.DB_URL));
    console.log(process.env.DB_URL)
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};
 