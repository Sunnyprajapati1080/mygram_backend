const bcrypt = require("bcryptjs");
const express = require("express");
const { validationResult, body } = require("express-validator");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../../models/user");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const sharp = require("sharp");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploads = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  uploads.single("profileImg"),
  [
    body("username").isString().notEmpty().withMessage("username is required"),
    body("email").isEmail().withMessage("enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("password should be at least 6 characters long."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const userExists = await User.findOne({ email: req.body.email });
      if (userExists) return res.status(400).json({ error: "Sorry! A user with this email already exists!" });

      if (await User.findOne({ username: req.body.username }))
        return res.status(401).json({ duplicateName: "Sorry! This username is unavailable!" });

      const hashedPassword = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
      let profileImgUrl = "";

      if (req.file) {
        try {
          const compressedImage = await sharp(req.file.buffer).rotate().jpeg({ quality: 80 }).toBuffer();
          const result = await new Promise((resolve, reject) =>
            cloudinary.uploader.upload_stream({ folder: "instagram_clone", resource_type: "image" }, (err, res) =>
              err ? reject(err) : resolve(res)
            ).end(compressedImage)
          );
          profileImgUrl = result.secure_url;
        } catch {
          return res.status(500).json({ error: "Image upload failed. Please try again." });
        }
      }

      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        profileImg: profileImgUrl,
        password: hashedPassword,
        followers: req.body.followers || [],
        following: req.body.following || [],
        activities: [],
      }).save();

      res.json({ token: jwt.sign({ id: newUser._id }, process.env.JWT_SECRET), id: newUser._id, username: newUser.username });
    } catch (error) {
      res.status(500).send({ error: `Internal server error occurred: ${error.message}` });
    }
  }
);

module.exports = { router, uploads };
