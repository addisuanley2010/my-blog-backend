const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const cloudinary = require("../cloudinary");

const fs = require("fs");

const createPost = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const { buffer } = req.file;

    if (!title || !description || !category) {
      res.json({
        message: "Please fill all the fields",
      });
    } else {
      const tempFilePath = `/tmp/${req.file.originalname}`;

      fs.writeFileSync(tempFilePath, buffer);

      const cloudinaryUpload = await cloudinary.uploader.upload(tempFilePath, {
        folder: "posts",
        width: 300,
        crop: "scale",
      });

      // Delete the temporary file
      fs.unlinkSync(tempFilePath);

      const newPost = await postModel.create({
        title,
        category,
        description,
        creator: req.user.id,
        imageName: cloudinaryUpload.public_id,
        imagePath: cloudinaryUpload.secure_url,
      });

      if (!newPost) {
        res.json({
          message: "Post not created",
        });
      } else {
        const currentUser = await userModel.findById(req.user.id);
        const userPostCount = currentUser.posts + 1;

        await userModel.findByIdAndUpdate(req.user.id, {
          posts: userPostCount,
        });

        res.json({
          success: "Post created successfully!",
        });
      }
    }
  } catch (error) {
    res.json({
      message: "fill all fields",
    });
  }
};
// ......................................................
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await postModel.find().sort({ updatedAt: -1 });
    res.json({
      message: posts,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};
// ......................................................
const getSinglePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);
    if (!post) {
      res.json({
        message: "post not found",
      });
    } else {
      res.json({
        post,
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};     


// ......................................................
const getPostsByCatagory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const catagoryPosts = await postModel
      .find({ category })
      .sort({ updatedAt: -1 });
    if (catagoryPosts == "") {
      res.json({
        message: "no post found .",
      });
    } else {
      res.json({
        catagoryPosts,
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};
// ......................................................

const getPostsByAutor = async (req, res, next) => {
  try {
    const { authorId } = req.params;
    const authorPosts = await postModel
      .find({ creator: authorId })
      .sort({ updatedAt: -1 });
    if (authorPosts == "") {
      res.json({
        message: "no post found .",
      });
    } else {
      res.json({
        authorPosts,
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};
// ......................................................
const editPost = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const { id } = req.params;
    if (!title || !description || !category) {
      res.json({
        message: "please ,fill all the fields",
      });
    } else {
      const checkPostOwner = await postModel.findById(id);

      if (!checkPostOwner) {
        res.json({ message: "post not found" });
      } else {
        if (req.user.id != checkPostOwner.creator) {
          res.json({
            message:
              "This post is created by other author , you are not allowed to edit .",
          });
        } else {
          const updatedPost = await postModel.findByIdAndUpdate(
            id,
            {
              title,
              category,
              description,
            },
            { new: true }
          );
          if (!updatedPost) {
            res.json({
              message: "post not updated",
            });
          } else {
            res.json({
              success: "successfully updated",
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};
// ....................................................
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const checkPostOwner = await postModel.findById(id);

    if (!checkPostOwner) {
      res.json({ message: "post not found" });
    } else {
      if (req.user.id != checkPostOwner.creator) {
        res.json({
          message:
            "This post is created by other author , you are not allowed to delete .",
        });
      } else {
        const deletedData = await postModel.findByIdAndDelete(id);
        if (!deletedData) {
          res.json({
            message: "post not deleted",
          });
        } else {
          const currentUser = await userModel.findById(req.user.id);
          const userPostCount = currentUser.posts - 1;
          await userModel.findByIdAndUpdate(req.user.id, {
            posts: userPostCount,
          });

          res.json({
            success: "post deleted successfully!",
          });
        }
      }
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  getPostsByAutor,
  getPostsByCatagory,
  editPost,
  deletePost,
};
