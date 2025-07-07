// src/components/CreatePost.js
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { token } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await axios.post("${process.env.REACT_APP_API_URL}/api/posts", { title, content}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    nav("/");
  };

  return (
    <form onSubmit={submit} className="form">
      <h2>✍️ Create New Post</h2>
      <label>Post Title</label>
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Enter an engaging title..." 
        required 
      />
      <label>Content</label>
      <ReactQuill 
        value={content} 
        onChange={setContent}
        placeholder="Share your story with the world..."
        style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px',
          marginBottom: '1rem'
        }}
      />
      <button type="submit">🚀 Publish Post</button>
    </form>
  );
}
