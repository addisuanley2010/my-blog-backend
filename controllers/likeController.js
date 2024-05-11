const likeModel = require("../models/likeModel");
const postModel = require("../models/postModel");

const likePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const existingLike = await likeModel.findOne({
      post: postId,
      user: userId,
    });
    if (existingLike) {
      const like = await likeModel.findOneAndDelete(existingLike._id);

      const a = await postModel.findByIdAndUpdate(postId, {
        // $pull: { likes: like._id },
        $pull: { likes: userId },
      });

      return res.json({ message: "like removed" });
    } else {
      const like = await likeModel.create({ post: postId, user: userId });

      const b = await postModel.findByIdAndUpdate(postId, {
        // $push: { likes: like._id },
        $push: { likes: userId },
      });
      return res.status(200).json({ success: "Post liked successfully." });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  likePost,
};
