const { Router } = require("express");
const { likePost } = require("../controllers/likeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

router.post("/:postId", authMiddleware, likePost);

module.exports = router;
