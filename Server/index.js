require("dotenv").config();        // MUST be first
const userRoutes = require("./routes/User")
const express = require("express");
const { Dbconnect } = require("./config/database");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;
const dns = require("dns"); dns.setServers(["1.1.1.1", "8.8.8.8"])
Dbconnect();                       // ✅ connect ONCE

app.listen(PORT, () => {
  console.log(`App is running at port no ${PORT}`);
});
app.use("/api/v1/auth",userRoutes)
