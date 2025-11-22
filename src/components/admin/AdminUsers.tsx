import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { customFetch } from "../../utils/customFetch";
import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Badge,
  Button,
  Spinner,
  Alert,
  Table,
  Input,
  Label,
  FormGroup,
} from "reactstrap";

interface LocalGroup {
  group_name: string;
}

interface User {
  id: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  member_id?: number;
  role?: string;
  status?: string;
  local_group: LocalGroup | null;
  date_joined?: string;
  is_expert?: boolean;
}

type SortField = "name" | "email" | "local_group" | "status";
type SortDirection = "asc" | "desc";

interface Props {
  isActive: boolean;
}

const AdminUsers: React.FC<Props> = ({ isActive }) => {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Persisted filter & sort state
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [expertFilter, setExpertFilter] = useState<"all" | "experts" | "non-experts">(
    "all"
  );

  const fetchUsers = useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError("");
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const usersData = await customFetch(
        "users/all/",
        { method: "GET" },
        accessToken,
        refreshToken,
        navigate
      );
      console.log("Users data received:", usersData);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, navigate]);

  // Fetch on mount if active, and whenever isActive becomes true
  useEffect(() => {
    if (isActive) {
      fetchUsers();
    }
    // NOTE: intentionally not clearing state when isActive becomes false (persist state)
  }, [isActive, fetchUsers]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedAndFilteredUsers = () => {
    if (!Array.isArray(users)) return [];

    let filteredUsers = users;

    if (statusFilter !== "all") {
      filteredUsers = filteredUsers.filter((u) => u.status === statusFilter);
    }

    if (expertFilter !== "all") {
      filteredUsers = filteredUsers.filter((u) => {
        const isExpert = Boolean(u.is_expert);
        return expertFilter === "experts" ? isExpert : !isExpert;
      });
    }

    const sorted = [...filteredUsers].sort((a, b) => {
      let aValue = "";
      let bValue = "";

      switch (sortField) {
        case "name":
          aValue = `${a.first_name || ""} ${a.last_name || ""}`.trim().toLowerCase();
          bValue = `${b.first_name || ""} ${b.last_name || ""}`.trim().toLowerCase();
          break;
        case "email":
          aValue = (a.email || "").toLowerCase();
          bValue = (b.email || "").toLowerCase();
          break;
        case "local_group":
          aValue = a.local_group?.group_name?.toLowerCase() || "";
          bValue = b.local_group?.group_name?.toLowerCase() || "";
          break;
        case "status":
          aValue = (a.status || "").toLowerCase();
          bValue = (b.status || "").toLowerCase();
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
    return sortDirection === "asc" ? <> ▲</> : <> ▼</>;
  };

  if (!user || user.role !== "admin") {
    // In case parent missed it, guard again
    return <Alert color="danger">Access denied. Admin privileges required.</Alert>;
  }

  return (
    <div className="mt-3">
      <Row className="mb-3">
        <Col md="12">
          <h6>
            <strong>User Management</strong>
          </h6>
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
        <Col md="4">
          <FormGroup>
            <Label htmlFor="expertFilter">Filter by Expert Status:</Label>
            <Input
              id="expertFilter"
              type="select"
              value={expertFilter}
              onChange={(e) =>
                setExpertFilter(e.target.value as "all" | "experts" | "non-experts")
              }
            >
              <option value="all">All Users</option>
              <option value="experts">Experts</option>
              <option value="non-experts">Non-Experts</option>
            </Input>
          </FormGroup>
        </Col>
      </Row>

      {isLoading ? (
        <div className="text-center">
          <Spinner color="primary" />
          <p className="mt-2">Loading users...</p>
        </div>
      ) : error ? (
        <Alert color="danger">{error}</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped hover>
            <thead>
              <tr>
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
              {getSortedAndFilteredUsers().map((u) => (
                <tr key={u.id}>
                  <td>
                    {[u.first_name, u.last_name].filter(Boolean).join(" ") || "N/A"}
                  </td>
                  <td>{u.email || "N/A"}</td>
                  <td>{u.local_group?.group_name || "N/A"}</td>
                  <td>
                    <Badge color={u.status === "active" ? "success" : "secondary"}>
                      {u.status || "N/A"}
                    </Badge>
                  </td>
                  <td>
                    <Button color="primary" size="sm" tag={Link} to={`/user/${u.id}`}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
