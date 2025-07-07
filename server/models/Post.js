const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String, // store username directly
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: String }]
});

module.exports = mongoose.model("Post", PostSchema);
