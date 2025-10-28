import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Spinner,
  Alert,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useApiRequest } from "../../utils/useApiRequest";
import EditMember from "./EditMember";
import EditExpert from "./EditExpert";
import EditExpertise from "./EditExpertise";

interface EditProfileProps {
  memberId?: number; // optional: only provided by admin
}

const EditProfile: React.FC<EditProfileProps> = ({ memberId }) => {
  const { apiRequest } = useApiRequest();
  const [activeTab, setActiveTab] = useState("basic");
  const [userData, setUserData] = useState<any>(null);
  const [expertiseData, setExpertiseData] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  // const [isExpert, setIsExpert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllData();
  }, [memberId]);

  const fetchAllData = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fetch user data
      const userEndpoint = memberId ? `users/${memberId}/` : "users/me/";
      const user = await apiRequest(userEndpoint);
      setUserData(user);

      // Fetch expertise records for this expert
      const expertises = (await apiRequest(`expertises/by_user/${user.id}/`)) || [];
      setExpertiseData(expertises);

      // Fetch industries for expertise dropdowns
      const industryData = await apiRequest("industries/");
      setIndustries(industryData || []);

    } catch (err: any) {
      setError(err.message || "Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    // Refresh data after save
    fetchAllData();
  };

  const handleExpertiseChange = (index: number, data: Record<string, any>) => {
    setExpertiseData(prev => {
      const newData = [...prev];
      newData[index] = data;
      return newData;
    });
  };

  const toggleTab = (tab: string) => setActiveTab(tab);

  const addExpertise = () => {
    if (expertiseData.length >= 3) {
      return; // Limit to maximum 3 expertise records
    }
    setExpertiseData([
      ...expertiseData,
      {
        area_of_expertise: "",
        what_offering: "",
        who_would_benefit: "",
        why_choose_you: "",
        skills_not_offered: "",
      },
    ]);
  };

  const removeExpertise = async (index: number) => {
    const item = expertiseData[index];

    // If record exists in DB (has an id) → delete via API
    if (item.id) {
      try {
        await apiRequest(`expertises/${item.id}/`, {method: "DELETE"});
      } catch (err: any) {
        console.error("Failed to delete expertise:", err);
        alert("Error deleting expertise. Please try again.");
        return;
      }
    }

    if (expertiseData.length > 1) {
      setExpertiseData(expertiseData.filter((_, i) => i !== index));
    }
  };

  if (isLoading) {
    return (
      <Container className="centered-container">
        <div className="text-center">
          <Spinner color="primary" />
          <p className="mt-2">Loading profile...</p>
        </div>
      </Container>
    );
  }

  if (error && !userData) {
    return (
      <Container className="centered-container">
        <Alert color="danger">{error}</Alert>
        <div className="text-center">
          <Button color="primary" tag={Link} to="/dashboard">
            Back to Dashboard
          </Button>
        </div>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container className="centered-container">
        <Alert color="warning">No profile data available.</Alert>
        <div className="text-center">
          <Button color="primary" tag={Link} to="/dashboard">
            Back to Dashboard
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="centered-container">
      <Card className="text-dark bg-light m-3">
        <CardHeader>
          <CardTitle tag="h4" className="text-center mb-0">
            <strong>{memberId ? "Edit Member Profile" : "My Profile"}</strong>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === "basic" ? "active" : ""}
                onClick={() => toggleTab("basic")}
                style={{ cursor: "pointer" }}
              >
                Basic Information
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={activeTab === "expert" ? "active" : ""}
                onClick={() => toggleTab("expert")}
                style={{ cursor: "pointer" }}
              >
                Expert Profile
              </NavLink>
            </NavItem>
            
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="basic">
              {userData && <EditMember data={userData} onSave={handleSave} isAdminMode={!!memberId} />}
            </TabPane>

            <TabPane tabId="expert">
              {userData && (
                <EditExpert 
                  data={userData} 
                  onSave={handleSave}
                  expertiseData={expertiseData}
                  userId={userData.id}
                />
              )}
              
              <div className="mt-4">
                <hr />
                <h6>
                  <strong>Expertise Records</strong>
                </h6>

                {expertiseData.map((item, idx) => (
                  <EditExpertise
                    key={item.id || idx}
                    data={item}
                    index={idx}
                    onRemove={() => removeExpertise(idx)}
                    showRemove={expertiseData.length > 1}
                    onChange={handleExpertiseChange}
                    industries={industries}
                  />
                ))}

                <Button 
                  color="secondary" 
                  onClick={addExpertise} 
                  className="mb-3"
                  disabled={expertiseData.length >= 3}
                >
                  Add Another Expertise {expertiseData.length >= 3 ? "(Maximum 3)" : ""}
                </Button>
              </div>
            </TabPane>
          </TabContent>
        </CardBody>
        <div className="text-center p-3">
          <Button color="secondary" tag={Link} to={memberId ? "/admin" : "/dashboard"}>
            {memberId ? "Back to Admin Panel" : "Back to Dashboard"}
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default EditProfile;
