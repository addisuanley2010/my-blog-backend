const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageName: {
      type: String,
    },
    imagePath: {
      type: String,
    },
    posts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
