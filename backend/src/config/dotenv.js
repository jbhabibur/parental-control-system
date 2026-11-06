const dotenv = require("dotenv");

dotenv.config();

const requiredVariables = [
  "MONGODB_URI",
  "JWT_SECRET"
];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`${variable} is missing in .env file`);
  }
}

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:8081",
  JWT_SECRET: process.env.JWT_SECRET
};