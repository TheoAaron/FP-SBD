// import { MongoClient } from "mongodb";
const { MongoClient } = require("mongodb");

// Ensure environment variables are loaded
require('dotenv').config();

const MONGO_HOST = process.env.MONGO_HOST || '127.0.0.1';
const MONGO_PORT = process.env.MONGO_PORT || '27017';
const DB_NAME = process.env.DB_NAME || 'sbdjaya';

const MONGO_URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${DB_NAME}`;
console.log('MongoDB URI:', MONGO_URI);

const client = new MongoClient(MONGO_URI);

let dbConnection;

const connectDB = async () => {
  if (dbConnection) {
    console.log("MongoDB already connected ✅");
    return;
  }
  try {
    await client.connect();
    dbConnection = client.db(DB_NAME);
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

module.exports = { connectDB, getDB };

