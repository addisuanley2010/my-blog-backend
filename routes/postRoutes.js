const { Router } = require("express");
const multer = require("multer");
const upload = multer();
const {
  createPost,
  getAllPosts,
  getSinglePost,
  getPostsByCatagory,
  getPostsByAutor,
  deletePost,
  editPost,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();
 
router.post("/",upload.single("image"),authMiddleware, createPost);
router.get("/", getAllPosts);
router.get("/:id", getSinglePost);
router.get("/catagories/:category", getPostsByCatagory);
router.get("/users/:authorId", getPostsByAutor);
router.put("/:id", authMiddleware, editPost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
