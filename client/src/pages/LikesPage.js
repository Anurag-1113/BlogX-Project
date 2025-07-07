import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";

export default function LikesPage() {
  const { token, user } = useContext(AuthContext);
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        const filtered = res.data.filter(
          (post) => post.author === user.username
        );
        // Filter out JavaScript snippet posts
        const cleanPosts = filtered.filter(post => 
          !post.title.toLowerCase().includes('javascript') &&
          !post.title.toLowerCase().includes('snippet') &&
          !post.content.toLowerCase().includes('console.log') &&
          !post.content.toLowerCase().includes('function') &&
          !post.content.toLowerCase().includes('const ') &&
          !post.content.toLowerCase().includes('let ') &&
          !post.content.toLowerCase().includes('var ')
        );
        setMyPosts(cleanPosts);
      } catch (err) {
        console.error(err);
        setMyPosts([]);
      }
    };
    fetchMyPosts();
  }, [user]);

  return (
    <div className="container">
      <h2>Who Liked My Posts</h2>
      {myPosts.length === 0 ? (
        <p>You haven't created any posts yet.</p>
      ) : (
        myPosts.map((post) => (
          <div key={post._id} className="card">
            <h3>{post.title}</h3>
            <p>
              <strong>Likes:</strong> {post.likes?.length || 0}
            </p>
            {post.likes?.length > 0 ? (
              <ul>
                {post.likes.map((username, index) => (
                  <li key={index}>❤️ {username}</li>
                ))}
              </ul>
            ) : (
              <p>No one liked this post yet.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
