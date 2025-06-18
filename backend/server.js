require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectMongo = require("./config/mongo");
const { connectMySQL } = require("./config/mysql");

const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminMiddleware = require("./middlewares/admin");
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => res.send("🛒 Backend running with Mongo & MySQL"));
app.use("/api/auth", authRoutes );
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

const start = async () => {
  await connectMongo();
  await connectMySQL();

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
};

start();
