require("dotenv").config(); // MUST be first

const express = require("express");
const http = require("http");
const dns = require("dns");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const Routes = require("./routes")
//userRoutes =  require("./routes/auth")
const { Dbconnect } = require("./config/database");
const configureSocket = require("./config/socket");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: "*", 
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ===== DATABASE =====
Dbconnect();

// ===== SERVER + SOCKET =====
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
configureSocket(server);

// ===== ROUTES =====
app.use("/api/v1",Routes);

// ===== START SERVER =====
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
