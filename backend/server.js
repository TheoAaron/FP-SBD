require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectMongo = require("./config/mongo");
const { connectMySQL } = require("./config/mysql");

const authRoutes = require("./routes/authRoutes");
const User = require("./models/mysql/user");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routing
app.use("/api/auth", authRoutes); // add auth routes for login and register

app.get("/", (req, res) => res.send("🛒 Backend running with Mongo & MySQL"));

const start = async () => {
  await connectMongo();
  await connectMySQL();
  await User.sync(); // ← sync tabel

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
};

start();
