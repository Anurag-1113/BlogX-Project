// server/routes/posts.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.sendStatus(403);
  }
}

router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

router.post("/", authMiddleware, async (req, res) => {
  const newPost = new Post({
    ...req.body,
    author: req.user.username,
  });
  await newPost.save();
  res.status(201).json(newPost);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  // ❌ Logic was reversed before. Correct condition:
  if (post.author !== req.user.username) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await post.deleteOne();
  res.json({ message: "Deleted successfully" });
});

// PUT /api/posts/:id - update a post
router.put("/:id", authMiddleware, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.author !== req.user.username) {
    return res.status(403).json({ message: "Not authorized to edit this post" });
  }

  post.title = req.body.title;
  post.content = req.body.content;

  await post.save();
  res.json({ message: "Post updated", post });
});

// routes/posts.js
router.post("/:id/like", authMiddleware, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const username = req.user.username;
  const alreadyLiked = post.likes.includes(username);

  if (alreadyLiked) {
    post.likes = post.likes.filter((u) => u !== username);
  } else {
    post.likes.push(username);
  }

  await post.save();
  res.json({ likes: post.likes.length, liked: !alreadyLiked });
});


module.exports = router;
