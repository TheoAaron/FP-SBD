require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectMongo = require("./config/mongo");
const { connectMySQL } = require("./config/mysql");

const testRoutes = require("./routes/testRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => res.send("🛒 Backend running with Mongo & MySQL"));
app.use("/api", testRoutes);

const start = async () => {
  await connectMongo();
  await connectMySQL();

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
};

start();
