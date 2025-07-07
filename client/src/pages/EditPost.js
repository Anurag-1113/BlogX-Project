import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts`);
        const post = res.data.find((p) => p._id === id);
        if (!post) return alert("Post not found");
        setTitle(post.title);
        setContent(post.content);
      } catch (err) {
        alert("Failed to load post");
      }
    };
    fetchPost();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/posts/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      nav("/");
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <form onSubmit={submit} className="form">
      <h2>Edit Post</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <ReactQuill value={content} onChange={setContent} />
      <button type="submit">Update</button>
    </form>
  );
}
