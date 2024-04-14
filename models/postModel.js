const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    imageName: {
      type: String,
    },
    imagePath: {
      type: String,
    },
  },
  { timestamps: true }
);

const postModel = model("posts", postSchema);

module.exports = postModel;
