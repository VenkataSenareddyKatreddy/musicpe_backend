import { MongoClient } from "mongodb";
import dontenv from "dotenv";
// import mongoose from "mongoose";
dontenv.config();

// Create a new MongoClient
const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// const mongoose = require("mongoose");
// mongoose.connect(process.env.MONGO_URI)

const conn = await client.connect();
conn.once("open", () => {
  console.log("MongoDB database connection established successfully");
});
conn.on("error",(err)=>{
  console.log(err+"Couldn't connect")
});
export default conn;
