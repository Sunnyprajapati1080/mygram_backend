// const express = require("express");
// const router = express.Router();
// const fetchUser = require("../../middlewares/fetchUser");
// const Post = require("../../models/post");
// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const streamifier = require("streamifier");

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Use Multer to store images in memory
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Post Upload Route
// router.post("/", fetchUser, upload.single("img"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded!" });

//     // Upload image to Cloudinary
//     const result = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder: "instagram_clone/posts", resource_type: "image" },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       );
//       streamifier.createReadStream(req.file.buffer).pipe(stream);
//     });

//     // Create a new post with the Cloudinary image URL
//     const newPost = new Post({
//       user: req.user.id,
//       img: result.secure_url, // Cloudinary URL
//       desc: req.body.desc,
//       likedUsers: [],
//       comments: [],
//     });

//     await newPost.save();
//     res.json({ success: "Your post has been uploaded successfully!" });
//   } catch (error) {
//     res.status(500).send({ error: `Upload failed: ${error.message}` });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const fetchUser = require("../../middlewares/fetchUser");
const Post = require("../../models/post");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const sharp = require("sharp");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use Multer to store images in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Post Upload Route
router.post("/", fetchUser, upload.single("img"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded!" });

    // Compress image using sharp
    const compressedImage = await sharp(req.file.buffer)
      .rotate()
      .resize(1080) // Resize while maintaining aspect ratio
      .jpeg({ quality: 70 }) // Convert to JPEG with 70% quality
      .toBuffer();

    // Upload compressed image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "instagram_clone/posts", resource_type: "image" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      streamifier.createReadStream(compressedImage).pipe(stream);
    });

    // Create a new post with the Cloudinary image URL
    await new Post({
      user: req.user.id,
      img: result.secure_url,
      desc: req.body.desc,
      likedUsers: [],
      comments: [],
    }).save();

    res.json({ success: "Your post has been uploaded successfully!" });
  } catch (error) {
    res.status(500).send({ error: `Upload failed: ${error.message}` });
  }
});

module.exports = router;
