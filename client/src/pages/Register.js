// src/pages/Register.js
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const nav = useNavigate();
  const { setToken, setUser } = useContext(AuthContext);

  const register = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      return setError("Passwords do not match.");
    }

    try {
      const res = await axios.post("${process.env.REACT_APP_API_URL}/api/auth/register", {
        username,
        password,
      });
      setToken(res.data.token);
      setUser({ username: res.data.username }); // updated to store object
      nav("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={register} className="form">
      <h2>🚀 Join BlogX</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>
        Create your account to start sharing
      </p>
      {error && <p className="error">{error}</p>}

      <label>Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Choose a unique username"
        required
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a strong password"
        required
      />

      <label>Confirm Password</label>
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Re-enter your password"
        required
      />

      <button type="submit">🎉 Create Account</button>
      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
        Already have an account? <a href="/login" style={{ color: '#4ecdc4', textDecoration: 'none' }}>Sign in</a>
      </p>
    </form>
  );
}
