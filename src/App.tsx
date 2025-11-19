import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Container } from "reactstrap";

// Public / Static Pages
import About from "./components/public/About";
import Welcome from "./components/public/Welcome";
import Feedback from "./components/public/Feedback";
import Faq from "./components/public/Faq";

// User Pages
import Login from "./components/user/Login";
import Logout from "./components/user/Logout";
import Register from "./components/user/Register";
import Profile from "./components/user/EditProfile";
import UserDetail from "./components/user/UserDetail";
import AdminEditUser from "./components/user/AdminEditUser";

// Expert Pages
import Experts from "./components/experts/Experts";

// Admin Pages
import Admin from "./components/admin/Admin";

// Shared
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Secret from "./components/members/Secret";
import Dashboard from "./components/members/Dashboard";

// Main Menu
import { useAuth } from "./context/AuthContext";
import MainMenu from "./components/shared/MainMenu";
import Footer from "./components/shared/Footer";

function App() {
  const { isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Fix malformed paths (e.g., "/!" from Railway redirects)
  useEffect(() => {
    if (location.pathname === "/!") {
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);
  
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  return (
    <>
      <MainMenu />
      <div style={{ paddingTop: "76px" }}>
        <Container className="centered-container">
          <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/faq" element={<Faq />} />

        {/* Protected Routes */}
        <Route
          path="/secret"
          element={<ProtectedRoute element={<Secret />} />}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/experts"
          element={<ProtectedRoute element={<Experts />} />}
        />
        <Route
          path="/expert/:id"
          element={<ProtectedRoute element={<UserDetail />} />}
        />

        <Route
          path="/admin"
          element={<ProtectedRoute element={<Admin />} />}
        />
        <Route
          path="/user/:id"
          element={<ProtectedRoute element={<AdminEditUser />} />}
        />

        <Route path="/logout" element={<ProtectedRoute element={<Logout />} />} />

        {/* Handle malformed redirects (e.g., from Cloudflare) */}
        <Route path="/!" element={<Navigate to="/" replace />} />
        
        {/* Catch-all route - redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default App;
