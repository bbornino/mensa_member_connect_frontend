import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { customFetch } from "../../utils/customFetch";
import { API_BASE_URL } from "../../utils/constants";
import {
  Container,
  Card,
  CardTitle,
  CardBody,
  Row,
  Col,
  Badge,
  Button,
  Spinner,
  Alert,
  Table,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  member_id: number;
  role: string;
  status: string;
  date_joined: string;
}

interface AdminAction {
  id: number;
  admin: {
    username: string;
  };
  target_user: {
    username: string;
  };
  action: string;
  created_at: string;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user?.role !== "admin") {
      setError("Access denied. Admin privileges required.");
      setIsLoading(false);
      return;
    }

    const fetchAdminData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all users
        const usersData = await customFetch(
          "users/all/",
          { method: "GET" },
          null,
          null,
          () => {}
        );
        setUsers(usersData);

        // Fetch admin actions
        const actionsData = await customFetch(
          "admin_actions/",
          { method: "GET" },
          null,
          null,
          () => {}
        );
        setAdminActions(actionsData);

      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        setError("Failed to load admin data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  const handleUserStatusChange = async (userId: number, newStatus: string) => {
    try {
      await customFetch(
        `users/${userId}/`,
        {
          method: "PATCH",
          body: { status: newStatus }
        },
        null,
        null,
        () => {}
      );
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      alert(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update user status:", error);
      alert("Failed to update user status. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <Container className="centered-container">
        <div className="text-center">
          <Spinner color="primary" />
          <p className="mt-2">Loading admin panel...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="centered-container">
        <Alert color="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="centered-container">
      <Card className="text-dark bg-light m-3">
        <CardTitle tag="h4" className="text-center mb-4">
          <strong>Admin Panel</strong>
        </CardTitle>
        <CardBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === "users" ? "active" : ""}
                onClick={() => setActiveTab("users")}
                style={{ cursor: "pointer" }}
              >
                Users ({users.length})
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "actions" ? "active" : ""}
                onClick={() => setActiveTab("actions")}
                style={{ cursor: "pointer" }}
              >
                Admin Actions ({adminActions.length})
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="users">
              <div className="mt-3">
                <h6><strong>User Management</strong></h6>
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Member ID</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.first_name} {user.last_name}</td>
                          <td>{user.email}</td>
                          <td>{user.member_id}</td>
                          <td>
                            <Badge color={user.role === "admin" ? "danger" : "primary"}>
                              {user.role}
                            </Badge>
                          </td>
                          <td>
                            <Badge color={user.status === "active" ? "success" : "secondary"}>
                              {user.status}
                            </Badge>
                          </td>
                          <td>
                            {user.status === "active" ? (
                              <Button
                                color="warning"
                                size="sm"
                                onClick={() => handleUserStatusChange(user.id, "inactive")}
                              >
                                Deactivate
                              </Button>
                            ) : (
                              <Button
                                color="success"
                                size="sm"
                                onClick={() => handleUserStatusChange(user.id, "active")}
                              >
                                Activate
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </TabPane>

            <TabPane tabId="actions">
              <div className="mt-3">
                <h6><strong>Admin Actions Log</strong></h6>
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
                          <td>{action.admin.username}</td>
                          <td>{action.target_user.username}</td>
                          <td>{action.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Admin;
