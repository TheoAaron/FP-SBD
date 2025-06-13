const { MongoClient } = require("mongodb");

const MONGO_URI = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.DB_NAME}`;
const client = new MongoClient(MONGO_URI);

let dbConnection;

const connectDB = async () => {
  if (dbConnection) {
    console.log("MongoDB already connected ✅");
    return dbConnection;
  }
  try {
    await client.connect();
    dbConnection = client.db(process.env.DB_NAME);
    console.log("MongoDB connected ✅");
    return dbConnection;
  } catch (err) {
    console.error("MongoDB connection error ❌", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
