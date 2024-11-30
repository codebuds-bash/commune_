const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  user: {
    type: String, // User's name or ID
    required: true,
  },
  content: {
    type: String, // Text content
    required: true,
  },
  image: {
    type: String, // URL or path to the image
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically store creation date
  },
});

module.exports = mongoose.model("Post", PostSchema);
