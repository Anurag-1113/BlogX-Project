import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function Navbar() {
  const { token, setToken, user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">BlogX</Link>
        {token && (
        <>
          <Link to="/create">Create</Link>
          <Link to="/likes">Likes</Link>
        </>
        )}

      </div>
      <div className="nav-right">
        {token ? (
          <>
            <span className="welcome">
              Hi, {user?.username || "User"}
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
