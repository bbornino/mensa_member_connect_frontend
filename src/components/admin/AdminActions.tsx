import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { customFetch } from "../../utils/customFetch";
import { useNavigate } from "react-router-dom";
import { Spinner, Alert, Table } from "reactstrap";

interface AdminAction {
  id: number;
  admin_id: number;
  admin_name: string;
  user_id: number;
  user_name: string;
  action: string;
  created_at: string;
}

interface Props {
  isActive: boolean;
}

const AdminActions: React.FC<Props> = ({ isActive }) => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();

  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchActions = useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError("");
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const actionsData = await customFetch(
        "admin_actions/",
        { method: "GET" },
        accessToken,
        refreshToken,
        navigate
      );
      console.log("Admin actions data received:", actionsData);
      setAdminActions(Array.isArray(actionsData) ? actionsData : []);
    } catch (err) {
      console.error("Failed to fetch admin actions:", err);
      setError("Failed to load admin actions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, navigate]);

  // Fetch on mount if active, and whenever isActive becomes true
  useEffect(() => {
    if (isActive) {
      fetchActions();
    }
    // Keep in-memory state between tab switches
  }, [isActive, fetchActions]);

  if (!user || user.role !== "admin") {
    return <Alert color="danger">Access denied. Admin privileges required.</Alert>;
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner color="primary" />
        <p className="mt-2">Loading admin actions...</p>
      </div>
    );
  }

  if (error) {
    return <Alert color="danger">{error}</Alert>;
  }

  return (
    <div className="mt-3">
      <h6>
        <strong>Admin Actions Log</strong>
      </h6>
      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Admin</th>
              <th>Target User</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {adminActions.map((action) => (
              <tr key={action.id}>
                <td>{new Date(action.created_at).toLocaleDateString()}</td>
                <td>{action.admin_name}</td>
                <td>{action.user_name}</td>
                <td>{action.action}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminActions;
