require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const path = require('path');
const multer = require('multer'); // Added for handling file uploads

// Import Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

// Middleware
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Middleware Configuration
app.use(cors());
app.use(express.json()); // Body parsing
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Routes for Image Upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imagePath = `/uploads/${req.file.filename}`;
  res.status(200).json({ message: "Image uploaded successfully", path: imagePath });
});

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/posts', postRoutes);// Protect this route with authentication

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
