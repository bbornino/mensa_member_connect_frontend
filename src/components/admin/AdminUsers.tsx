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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
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

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Email modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number } | null>(null);

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

  const visibleUsers = getSortedAndFilteredUsers();
  const visibleIds = visibleUsers.map((u) => u.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  const someVisibleSelected = visibleIds.some((id) => selectedIds.has(id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const openEmailModal = () => {
    setSendResult(null);
    setEmailSubject("");
    setEmailBody("");
    setEmailModalOpen(true);
  };

  const closeEmailModal = () => {
    if (!isSending) setEmailModalOpen(false);
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) return;
    setIsSending(true);
    setSendResult(null);
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const result = await customFetch(
        "users/bulk_email/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_ids: Array.from(selectedIds),
            subject: emailSubject.trim(),
            body: emailBody.trim(),
          }),
        },
        accessToken!,
        refreshToken,
        navigate
      );
      setSendResult({ sent: result.sent, failed: result.failed });
    } catch (err) {
      console.error("Failed to send bulk email:", err);
      setSendResult({ sent: 0, failed: selectedIds.size });
    } finally {
      setIsSending(false);
    }
  };

  if (!user || user.role !== "admin") {
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

      {/* Bulk email action bar */}
      {selectedIds.size > 0 && (
        <Row className="mb-3">
          <Col>
            <Button color="primary" onClick={openEmailModal}>
              Send Email to Selected ({selectedIds.size})
            </Button>
            <Button
              color="link"
              className="ms-2 text-muted"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear selection
            </Button>
          </Col>
        </Row>
      )}

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
                <th style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someVisibleSelected && !allVisibleSelected;
                    }}
                    onChange={toggleSelectAll}
                    aria-label="Select all visible users"
                  />
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
                <th>Expert Profile</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <Input
                      type="checkbox"
                      checked={selectedIds.has(u.id)}
                      onChange={() => toggleSelect(u.id)}
                      aria-label={`Select ${u.first_name} ${u.last_name}`}
                    />
                  </td>
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
                  <td className="text-center">
                    {u.is_expert ? (
                      <span title="Expert profile completed" aria-label="Expert profile completed">
                        ✓
                      </span>
                    ) : (
                      <span className="text-muted" title="Expert profile not completed" aria-label="Expert profile not completed">

                      </span>
                    )}
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

      {/* Bulk email modal */}
      <Modal isOpen={emailModalOpen} toggle={closeEmailModal} size="lg">
        <ModalHeader toggle={closeEmailModal}>
          Send Email to {selectedIds.size} Member{selectedIds.size !== 1 ? "s" : ""}
        </ModalHeader>
        <ModalBody>
          {sendResult ? (
            <Alert color={sendResult.failed === 0 ? "success" : "warning"} fade={false}>
              {sendResult.sent > 0 && (
                <div>Successfully sent to {sendResult.sent} member{sendResult.sent !== 1 ? "s" : ""}.</div>
              )}
              {sendResult.failed > 0 && (
                <div>Failed to send to {sendResult.failed} member{sendResult.failed !== 1 ? "s" : ""}.</div>
              )}
            </Alert>
          ) : (
            <>
              <FormGroup>
                <Label for="emailSubject">Subject</Label>
                <Input
                  id="emailSubject"
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject"
                  disabled={isSending}
                />
              </FormGroup>
              <FormGroup>
                <Label for="emailBody">Message</Label>
                <Input
                  id="emailBody"
                  type="textarea"
                  rows={8}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Write your message here..."
                  disabled={isSending}
                />
              </FormGroup>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {sendResult ? (
            <Button color="secondary" onClick={closeEmailModal}>
              Close
            </Button>
          ) : (
            <>
              <Button
                color="primary"
                onClick={handleSendEmail}
                disabled={isSending || !emailSubject.trim() || !emailBody.trim()}
              >
                {isSending ? <><Spinner size="sm" /> Sending...</> : "Send Email"}
              </Button>
              <Button color="secondary" onClick={closeEmailModal} disabled={isSending}>
                Cancel
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AdminUsers;
