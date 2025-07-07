const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Comment = require('../models/Comment');

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

// POST a comment
router.post("/", authMiddleware, async (req, res) => {
  const { postId, text } = req.body;
  const newComment = new Comment({
    postId,
    text,
    author: req.user.username,
  });
  await newComment.save();
  res.status(201).json(newComment);
});

// GET comments for a post
router.get("/:postId", async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
  res.json(comments);
});

module.exports = router;
