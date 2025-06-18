<<<<<<< HEAD
import { MongoClient } from "mongodb";

=======
// import { MongoClient } from "mongodb";
const { MongoClient } = require("mongodb");
>>>>>>> ba716e84b04737628502ae863bd2b303c8ed37d4
const MONGO_URI = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.DB_NAME}`;
const client = new MongoClient(MONGO_URI);

let dbConnection;

const connectDB = async () => {
  if (dbConnection) {
    console.log("MongoDB already connected ✅");
    return;
  }
  try {
    await client.connect();
    dbConnection = client.db(process.env.DB_NAME);
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error("MongoDB connection error ❌", err.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!dbConnection) throw new Error("DB not connected");
  return dbConnection;
};

<<<<<<< HEAD
export { connectDB, getDB };
=======
module.exports = { connectDB, getDB };

>>>>>>> ba716e84b04737628502ae863bd2b303c8ed37d4
