import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/comments/${postId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments", err);
      }
    };
    fetchComments();
  }, [postId]);

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/comments",
        { postId, text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prev) => [res.data, ...prev]);
      setText("");
    } catch (err) {
      console.error("Error posting comment", err);
      alert("Failed to comment. Are you logged in?");
    }
  };

  return (
    <div className="comment-section">
      <h4>💬 Comments ({comments.length})</h4>
      {token && (
        <form onSubmit={handleComment} className="comment-form">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
            required
          />
          <button type="submit">Post Comment</button>
        </form>
      )}
      {comments.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        comments.map((c, idx) => (
          <div key={idx} className="comment">
            <strong>{c.author}</strong>
            <div className="comment-text">{c.text}</div>
          </div>
        ))
      )}
    </div>
  );
}
