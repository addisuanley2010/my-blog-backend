const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configure Cloudinary with your API credentials
cloudinary.config({
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
});

module.exports = cloudinary;
