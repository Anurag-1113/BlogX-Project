// src/pages/Login.js
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const { setToken, setUser } = useContext(AuthContext);

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("${process.env.REACT_APP_API_URL}/api/auth/login", {
        username,
        password,
      });
      setToken(res.data.token);
      setUser({ username: res.data.username }); // updated to store object
      nav("/");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={login} className="form">
      <h2>👋 Welcome Back</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>
        Sign in to your account
      </p>
      <label>Username</label>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        required
      />
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
      />
      <button type="submit">🔐 Sign In</button>
      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
        Don't have an account? <a href="/register" style={{ color: '#4ecdc4', textDecoration: 'none' }}>Create one</a>
      </p>
    </form>
  );
}
