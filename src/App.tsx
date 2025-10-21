// import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "reactstrap";

// Public / Static Pages
import Welcome from "./components/public/Welcome";
import Feedback from "./components/public/Feedback";

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

function App() {
  const { isLoading } = useAuth();
  
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feedback" element={<Feedback />} />

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
          </Routes>
        </Container>
      </div>
    </>
  );
}

export default App;
