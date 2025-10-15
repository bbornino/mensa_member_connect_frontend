// import React from "react";
import { Routes, Route } from "react-router-dom";

// Public / Static Pages
import Welcome from "./components/public/Welcome";

// User Pages
import Login from "./components/user/Login";
import Logout from "./components/user/Logout";
import Register from "./components/user/Register";
import EditProfile from "./components/user/EditProfile";

// Shared
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Secret from "./components/members/Secret";
import Dashboard from "./components/members/Dashboard";

// Public Menu
import { useAuth } from "./context/AuthContext";
import PublicMenu from "./components/public/PublicMenu";
import MemberMenu from "./components/members/MemberMenu";

function App() {
  const { user } = useAuth();
  return (
    <>
      {user ? <MemberMenu /> : <PublicMenu />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
          path="/edit-profile"
          element={<ProtectedRoute element={<EditProfile />} />}
        />

        <Route path="/logout" element={<ProtectedRoute element={<Logout />} />} />
      </Routes>
    </>
  );
}

export default App;
