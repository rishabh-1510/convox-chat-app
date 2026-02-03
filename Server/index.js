require("dotenv").config(); // MUST be first

const express = require("express");
const http = require("http");
const dns = require("dns");

const userRoutes = require("./routes/User");
const { Dbconnect } = require("./config/database");
const configureSocket = require("./config/socket"); // <-- socket config file

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

// CREATE HTTP SERVER
const server = http.createServer(app);

// CONNECT DATABASE

Dbconnect(); // connect ONCE

// SOCKET.IO SETUP

configureSocket(server);

// ROUTES

app.use("/api/v1/auth", userRoutes);
// START SERVER

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
