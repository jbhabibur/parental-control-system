const mongoose = require("mongoose");
const { MONGODB_URI } = require("./dotenv");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB Atlas Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;