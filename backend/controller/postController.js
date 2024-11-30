// controllers/postController.js
const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Multer file filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

// Configure multer upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    }
});

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;

        // Check if content is provided
        if (!content) {
            return res.status(400).json({ error: 'Post content is required' });
        }

        // Create new post
        const post = new Post({
            content,
            user: req.user._id,
            image: req.file ? req.file.path : null
        });

        // Save the post
        await post.save();

        // Populate user details
        await post.populate('user', 'username profileImage');

        res.status(201).json(post);
    } catch (error) {
        console.error('Post creation error:', error);
        res.status(500).json({ 
            error: 'Failed to create post', 
            details: error.message 
        });
    }
};

// Get all posts
exports.getPosts = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipIndex = (page - 1) * limit;

        // Fetch posts with pagination and population
        const posts = await Post.find()
            .populate('user', 'username profileImage')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skipIndex);

        // Count total posts
        const totalPosts = await Post.countDocuments();

        res.status(200).json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts
        });
    } catch (error) {
        console.error('Fetch posts error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch posts', 
            details: error.message 
        });
    }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'username profileImage');

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Fetch post by ID error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch post', 
            details: error.message 
        });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.id;

        // Find the post
        const post = await Post.findById(postId);

        // Check if post exists
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if user is the post owner
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to update this post' });
        }

        // Update post
        post.content = content;
        if (req.file) {
            post.image = req.file.path;
        }

        await post.save();

        res.status(200).json(post);
    } catch (error) {
        console.error('Post update error:', error);
        res.status(500).json({ 
            error: 'Failed to update post', 
            details: error.message 
        });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        // Find the post
        const post = await Post.findById(postId);

        // Check if post exists
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if user is the post owner
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this post' });
        }

        // Delete post
        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Post deletion error:', error);
        res.status(500).json({ 
            error: 'Failed to delete post', 
            details: error.message 
        });
    }
};

// Middleware for file upload
exports.uploadMiddleware = upload.single('image');