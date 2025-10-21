import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { customFetch } from "../../utils/customFetch";
import { API_BASE_URL } from "../../utils/constants";
import { Link, useNavigate } from "react-router-dom";
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
  Input,
  Label,
  FormGroup,
} from "reactstrap";

interface LocalGroup {
  group_name: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  member_id: number;
  role: string;
  status: string;
  local_group: LocalGroup | null;
  date_joined?: string;
}

type SortField = "username" | "name" | "email" | "local_group" | "status";
type SortDirection = "asc" | "desc";

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
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  
  // Filter and sort states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("username");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    if (user?.role !== "admin") {
      setError("Access denied. Admin privileges required.");
      setIsLoading(false);
      return;
    }

    const fetchAdminData = async () => {
      try {
        setIsLoading(true);
        
        const refreshToken = localStorage.getItem("refresh_token");
        
        // Fetch all users
        const usersData = await customFetch(
          "users/all/",
          { method: "GET" },
          accessToken,
          refreshToken,
          navigate
        );
        console.log("Users data received:", usersData);
        setUsers(usersData || []);

        // Fetch admin actions
        const actionsData = await customFetch(
          "admin_actions/",
          { method: "GET" },
          accessToken,
          refreshToken,
          navigate
        );
        console.log("Admin actions data received:", actionsData);
        setAdminActions(actionsData || []);

      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        setError("Failed to load admin data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [user, accessToken, navigate]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedAndFilteredUsers = () => {
    // Ensure users is always an array
    if (!Array.isArray(users)) {
      return [];
    }
    
    let filteredUsers = users;

    // Apply status filter
    if (statusFilter !== "all") {
      filteredUsers = filteredUsers.filter(u => u.status === statusFilter);
    }

    // Apply sorting
    const sorted = [...filteredUsers].sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (sortField) {
        case "username":
          aValue = a.username.toLowerCase();
          bValue = b.username.toLowerCase();
          break;
        case "name":
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "local_group":
          aValue = a.local_group?.group_name?.toLowerCase() || "";
          bValue = b.local_group?.group_name?.toLowerCase() || "";
          break;
        case "status":
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          aValue = "";
          bValue = "";
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const SortIcon: React.FC<{ field: SortField }> = ({ field }) => {
    if (sortField !== field) return <span style={{ opacity: 0.3 }}> ⇅</span>;
    return sortDirection === "asc" ? " ▲" : " ▼";
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
                <Row className="mb-3">
                  <Col md="12">
                    <h6><strong>User Management</strong></h6>
                  </Col>
                </Row>
                
                {/* Filters */}
                <Row className="mb-3">
                  <Col md="4">
                    <FormGroup>
                      <Label htmlFor="statusFilter">Filter by Status:</Label>
                      <Input
                        id="statusFilter"
                        type="select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>

                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th 
                          onClick={() => handleSort("username")} 
                          style={{ cursor: "pointer", userSelect: "none" }}
                        >
                          Username <SortIcon field="username" />
                        </th>
                        <th 
                          onClick={() => handleSort("name")} 
                          style={{ cursor: "pointer", userSelect: "none" }}
                        >
                          Name <SortIcon field="name" />
                        </th>
                        <th 
                          onClick={() => handleSort("email")} 
                          style={{ cursor: "pointer", userSelect: "none" }}
                        >
                          Email <SortIcon field="email" />
                        </th>
                        <th 
                          onClick={() => handleSort("local_group")} 
                          style={{ cursor: "pointer", userSelect: "none" }}
                        >
                          Local Group <SortIcon field="local_group" />
                        </th>
                        <th 
                          onClick={() => handleSort("status")} 
                          style={{ cursor: "pointer", userSelect: "none" }}
                        >
                          Status <SortIcon field="status" />
                        </th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedAndFilteredUsers().map((user) => (
                        <tr key={user.id}>
                          <td>{user.username}</td>
                          <td>{user.first_name} {user.last_name}</td>
                          <td>{user.email}</td>
                          <td>{user.local_group?.group_name || "N/A"}</td>
                          <td>
                            <Badge color={user.status === "active" ? "success" : "secondary"}>
                              {user.status}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              color="primary"
                              size="sm"
                              tag={Link}
                              to={`/user/${user.id}`}
                            >
                              Edit
                            </Button>
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
