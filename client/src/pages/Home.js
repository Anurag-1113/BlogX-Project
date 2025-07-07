// src/pages/Home.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Comments from "../components/Comments";
import { AuthContext } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";


export default function Home() {
  const [posts, setPosts] = useState([]);
  const { user, token } = useContext(AuthContext);
  const nav = useNavigate();


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`);
        // Filter out any existing sample posts or JavaScript snippets
        const filteredPosts = res.data.filter(post => 
          !post.title.toLowerCase().includes('javascript') &&
          !post.title.toLowerCase().includes('snippet') &&
          !post.content.toLowerCase().includes('console.log') &&
          !post.content.toLowerCase().includes('function') &&
          !post.content.toLowerCase().includes('const ') &&
          !post.content.toLowerCase().includes('let ') &&
          !post.content.toLowerCase().includes('var ')
        );
        setPosts(filteredPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // If there's an error, show empty state
        setPosts([]);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Could not delete the post. Make sure you're the author.");
    }
  };
  const handleLike = async (id) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/${id}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts((prev) =>
      prev.map((post) =>
        post._id === id
          ? { ...post, likes: res.data.liked
              ? [...post.likes, user.username]
              : post.likes.filter((u) => u !== user.username) }
          : post
      )
    );
  } catch (err) {
    alert("Failed to like the post");
  }
};


  return (
    <div className="home-container">
      {/* Hero Section */}
      {posts.length === 0 ? (
        <div className="hero-section">
          <h1 className="hero-title">Welcome to BlogX</h1>
          <p className="hero-subtitle">
            Share your thoughts, ideas, and stories with the world
          </p>
          <div className="no-posts">
            <h2>🚀 Ready to get started?</h2>
            <p>Be the first to share your amazing content!</p>
            {user && (
              <Link to="/create" className="cta-button">
                Create Your First Post
              </Link>
            )}
            {!user && (
              <Link to="/login" className="cta-button">
                Join the Community
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="hero-section">
          <h1 className="hero-title">BlogX Community</h1>
          <p className="hero-subtitle">
            Discover amazing stories from our talented writers
          </p>
        </div>
      )}

      {/* Posts Grid */}
      <div className="posts-grid">
        {posts.map((post) => {
          const likedByUser = post.likes?.includes(user?.username);

          return (
            <div key={post._id} className="card fade-in">
              <h2>{post.title}</h2>
              <p className="author">by {post.author || "Unknown"}</p>
              <div className="card-content" dangerouslySetInnerHTML={{ __html: post.content }} />
              
              <Comments postId={post._id} />

              <div className="like-container">
                <button
                  className={`like-btn ${likedByUser ? "liked" : ""}`}
                  onClick={() => handleLike(post._id)}
                >
                  {likedByUser ? "❤️ Liked" : "🤍 Like"} ({post.likes.length})
                </button>
              </div>

              {user?.username === post.author && (
                <div className="post-actions">
                  <button className="edit-btn" onClick={() => nav(`/edit/${post._id}`)}>
                    ✏️ Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(post._id)}>
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
