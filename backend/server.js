require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const path = require('path');

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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", authMiddleware, postRoutes);  // Protect this route with authentication

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
