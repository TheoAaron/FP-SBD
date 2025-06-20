require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/mongo");
const { connectMySQL } = require("./config/mysql");

const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const couponRoutes = require("./routes/coupunRoutes");
const adminMiddleware = require("./middlewares/admin");
const authMiddleware = require("./middlewares/auth");
const shipmentRoutes = require("./routes/shipmentRoutes");


const cartRoutes = require("./routes/cartRoutes");
const lastViewRoute = require("./routes/lastViewRoute");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => res.send("🛒 Backend running with Mongo & MySQL"));
app.use("/api/auth", authRoutes );
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin",authMiddleware,adminMiddleware, adminRoutes);
app.use("/api/admin", couponRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/lastview", lastViewRoute);

const start = async () => {
  await connectDB();
  await connectMySQL();

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
};

start();
