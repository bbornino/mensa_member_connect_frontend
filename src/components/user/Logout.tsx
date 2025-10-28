// src/components/user/Logout.tsx
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();            // call AuthContext logout
      } finally {
        navigate("/login");        // redirect regardless of errors
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <p>Logging out...</p>
      {/* Optional: add spinner or animation here */}
    </div>
  );
}
