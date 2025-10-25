import React, { useState} from "react";
import { useAuth } from "../../context/AuthContext";
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
} from "reactstrap";
import AdminUsers from "./AdminUsers";
import AdminActions from "./AdminActions";
import AdminLocalGroups from "./AdminLocalGroups";
import AdminIndustryTypes from "./AdminIndustryTypes";

const Admin: React.FC = () => {
  const { user} = useAuth();
  const [activeTab, setActiveTab] = useState<string>("users");

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
