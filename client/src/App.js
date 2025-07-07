import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import LikesPage from "./pages/LikesPage";



function App() {
  return (
    <Router>
      {/* Glassmorphism Floating Elements */}
      <div className="floating-elements">
        <div className="floating-element">📝</div>
        <div className="floating-element">📚</div>
        <div className="floating-element">✍️</div>
        <div className="floating-element">💡</div>
        <div className="floating-element">📖</div>
        <div className="floating-element">🎨</div>
        <div className="floating-element">📄</div>
        <div className="floating-element">🔖</div>
        <div className="floating-element">📋</div>
        <div className="floating-element">🖋️</div>
        <div className="floating-element">📌</div>
        <div className="floating-element">🧠</div>
      </div>
      
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/likes" element={<LikesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
