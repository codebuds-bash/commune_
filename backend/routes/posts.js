const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const multer = require("multer");
const path = require("path");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file names
  },
});
const upload = multer({ storage });

// Route: Create a new post
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { user, content } = req.body;

    // Ensure required fields are provided
    if (!user || !content || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save the post to the database
    const post = new Post({
      user,
      content,
      image: `/uploads/${req.file.filename}`, // Store image path
    });

    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route: Get all posts
router.get("/feed", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Fetch all posts, newest first
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
