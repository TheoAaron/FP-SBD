const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGO_URI);

let dbConnection;

const connectDB = async () => {
  if (dbConnection) {
    console.log("MongoDB already connected ✅");
    return dbConnection;
  }
  try {
    await client.connect();
    // Extract database name from MongoDB URI or use default
    const dbName = process.env.DB_NAME || "sbdjaya";
    dbConnection = client.db(dbName);
    console.log("MongoDB connected ✅");
    return dbConnection;
  } catch (err) {
    console.error("MongoDB connection error ❌", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
