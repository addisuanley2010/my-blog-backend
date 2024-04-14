const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");




const cloudinary = require("../cloudinary");
const fs = require("fs");
// ......REGISTER USER..........
// ........UNPROTECTED..........

const userRegister = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password) {
      res.json({ message: "fill in all fields " });
    } else {
      const newEmail = email.toLowerCase();

      const emailExist = await userModel.findOne({ email: newEmail });
      if (emailExist) {
        res.json({ message: "Try again, Email already registered!" });
      } else {
        if (password.trim().length < 6) {
          res.json({ message: "password atleast 6 charactor" });
        } else {
          if (password != confirmPassword) {
            res.json({ message: "confirm password  do not mutch" });
          } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await userModel.create({
              name,
              email: newEmail,
              password: hashedPassword,
            });

            res.status(201).json({
              success: `${name}  registered successfully!`,
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

// ........LOGIN USER..........
// ........UNPROTECTED..........

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.json({
      message: "Enter Email and Password",
    });
  } else {
    const newEmail = email.toLowerCase();

    const user = await userModel.findOne({ email: newEmail });
    if (!user) {
      res.json({
        message: "User not found",
      });
    } else {
      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        res.json({
          message: "incorrect credintials",
        });
      } else {
        const { _id: id, email, name } = user; // to destructure from database response use reverse order
        const token = jwt.sign({ id, email }, SECRET_KEY);
        res.json({ id, email, name, token, success: "Successfully Login!" });
      }
    }
  }
};
//////////GET AUTHOR BY id.................

const getAuthorData = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id).select("-password");

    if (user) {
      res.json({ message: user });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

// .......GET USER PROFILE..........
// ........PROTECTED..........

const getProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id != id) {
      res.json({ message: " please login first" });
    } else {
      const user = await userModel.findById(id).select("-password");

      if (user) {
        res.json({ user });
      }
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

// ........CHANGE USER PROFILE IMAGE..........
// .............PROTECTED.................

const changeProfileImg = async (req, res, next) => {

 const { buffer } = req.file;
  try {
    const tempFilePath = `/tmp/${req.file.originalname}`;

    fs.writeFileSync(tempFilePath, buffer);

    const cloudinaryUpload = await cloudinary.uploader.upload(tempFilePath, {
      folder: "profile",
      width: 300,
      crop: "scale",
    });

    fs.unlinkSync(tempFilePath);

    const response = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        imageName: cloudinaryUpload.public_id,
        imagePath: cloudinaryUpload.secure_url,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ success: "Profile picture updated", response });
  } catch (error) {
    console.error("Error saving image to MongoDB:", error.message);
    return res.status(500).json({ error: "Error saving image" });
  }

 
};

// .....UPDATE USER'S PROFILE..........
// ........PROTECTED.................

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      res.json({
        message: "please fill all the fields",
      });
    } else {
      const user = await userModel.findById(req.user.id);

      if (!user) {
        res.json({
          message: "user not found",
        });
      } else {
        const checkPassword = await bcrypt.compare(
          currentPassword,
          user.password
        );
        if (!checkPassword) {
          res.json({
            message: "wrong current password",
          });
        } else {
          if (newPassword != confirmNewPassword) {
            res.json({ message: "new password do not much" });
          } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            const newUserPassword = await userModel
              .findByIdAndUpdate(
                req.user.id,
                { password: hashedPassword },
                { new: true }
              )
              .select("-password");
            res.json({
              success: "password changed successfully",
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
//.............EDIT NAME AND EMAIL .......

const editUserProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      res.json({
        message: "please fill all the fields",
      });
    } else {
      const user = await userModel.findById(req.user.id);

      if (!user) {
        res.json({
          message: "user not found",
        });
      } else {
        const emailExist = await userModel.findOne({ email });

        if (emailExist && emailExist._id != req.user.id) {
          res.json({
            message: "email already exist",
          });
        } else {
          const newUserData = await userModel
            .findByIdAndUpdate(req.user.id, { name, email }, { new: true })
            .select("-password");
          res.json({
            success: "updated successfully!",
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

// ..........GET ALL AUTHORS..........
//........... UNPROTECTED...........

const getAuthors = async (req, res, next) => {
  try {
    const authors = await userModel.find().select("-password");

    if (!authors) {
      res.json({
        message: "no author found",
      });
    } else {
      res.json({ authors });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
  getAuthors,
  editUserProfile,
  changeProfileImg,
  getProfile,
  getAuthorData,
  changePassword
};
