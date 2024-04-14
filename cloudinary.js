const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configure Cloudinary with your API credentials
cloudinary.config({
  cloud_name: process.env.Cloud_name,
  api_key: process.env.API_key,
  api_secret: process.env.API_secret,
});

module.exports = cloudinary;
  