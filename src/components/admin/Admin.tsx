import React, { useState, useEffect} from "react";
import { useAuth } from "../../context/AuthContext";
import { useApiRequest } from "../../utils/useApiRequest";
import {
  Container,
  Card,
  CardTitle,
  CardBody,
  Spinner,
  Alert,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
} from "reactstrap";
import AdminUsers from "./AdminUsers";
import AdminActions from "./AdminActions";
import AdminLocalGroups from "./AdminLocalGroups";
import AdminIndustryTypes from "./AdminIndustryTypes";

const Admin: React.FC = () => {
  const [stats, setStats] = useState<{
    total_users: number;
    total_experts: number;
    total_expertise: number;
    total_connection_requests: number;
  } | null>(null);

  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [activeTab, setActiveTab] = useState<string>("users");

  const { user} = useAuth();
  const { apiRequest } = useApiRequest();

  const fetchStats = async () => {
    setLoadingStats(true);
    setStatsError("");
    try {
      const data = await apiRequest("stats/");
      setStats(data);
    } catch (err: any) {
      setStatsError("Failed to load dashboard statistics.");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    document.title = "Admin | Network of American Mensa Member Experts";
    fetchStats();
  }, []);

  if (!user) {
    // If auth context hasn't provided a user yet, show a small spinner
    return (
      <Container className="centered-container">
        <div className="text-center">
          <Spinner color="primary" />
          <p className="mt-2">Checking permissions...</p>
        </div>
      </Container>
    );
  }

  if (user.role !== "admin") {
    return (
      <Container className="centered-container">
        <Alert color="danger">Access denied. Admin privileges required.</Alert>
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
          {/* Dashboard Widgets */}
          <div className="mb-4">
            <h5 className="mb-3">Dashboard</h5>
            <Row>
              <Col md={6} lg={3} className="mb-3">
                <Card className="h-100" style={{ borderLeft: '4px solid #007bff' }}>
                  <CardBody>
                    <h6 className="text-muted mb-2"># of Users</h6>
                    <h3 className="mb-0">{stats?.total_users}</h3>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6} lg={3} className="mb-3">
                <Card className="h-100" style={{ borderLeft: '4px solid #28a745' }}>
                  <CardBody>
                    <h6 className="text-muted mb-2"># of Experts</h6>
                    <h3 className="mb-0">{stats?.total_experts}</h3>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6} lg={3} className="mb-3">
                <Card className="h-100" style={{ borderLeft: '4px solid #ffc107' }}>
                  <CardBody>
                    <h6 className="text-muted mb-2"># of Expertise Offered</h6>
                    <h3 className="mb-0">{stats?.total_expertise}</h3>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6} lg={3} className="mb-3">
                <Card className="h-100" style={{ borderLeft: '4px solid #dc3545' }}>
                  <CardBody>
                    <h6 className="text-muted mb-2"># of Requests Sent</h6>
                    <h3 className="mb-0">{stats?.total_connection_requests}</h3>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>

          <hr className="my-4" />

          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === "users" ? "active" : ""}
                onClick={() => setActiveTab("users")}
                style={{ cursor: "pointer" }}
              >
                Users
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "actions" ? "active" : ""}
                onClick={() => setActiveTab("actions")}
                style={{ cursor: "pointer" }}
              >
                Admin Actions
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "industry_types" ? "active" : ""}
                onClick={() => setActiveTab("industry_types")}
                style={{ cursor: "pointer" }}
              >
                Industry Types
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "local_groups" ? "active" : ""}
                onClick={() => setActiveTab("local_groups")}
                style={{ cursor: "pointer" }}
              >
                Local Groups
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="users">
              <AdminUsers isActive={activeTab === "users"} />
            </TabPane>

            <TabPane tabId="actions">
              <AdminActions isActive={activeTab === "actions"} />
            </TabPane>

            <TabPane tabId="industry_types">
              <AdminIndustryTypes isActive={activeTab === "industry_types"} />
            </TabPane>

            <TabPane tabId="local_groups">
              <AdminLocalGroups isActive={activeTab === "local_groups"} />
            </TabPane>

          </TabContent>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Admin;
