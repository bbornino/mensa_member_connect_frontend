import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Alert, Button } from "reactstrap";
import { useAuth } from "../../context/AuthContext";
import EditProfile from "./EditProfile";

const AdminEditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <Container className="centered-container">
        <Alert color="danger">
          Access denied. Admin privileges required.
        </Alert>
        <div className="text-center">
          <Button color="primary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </Container>
    );
  }

  if (!id) {
    return (
      <Container className="centered-container">
        <Alert color="warning">Invalid user ID.</Alert>
        <div className="text-center">
          <Button color="primary" onClick={() => navigate("/admin")}>
            Back to Admin Panel
          </Button>
        </div>
      </Container>
    );
  }

  // Use EditProfile component with the user ID
  return <EditProfile memberId={parseInt(id, 10)} />;
};

export default AdminEditUser;

