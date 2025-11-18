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
  const [success, setSuccess] = useState("");

  useEffect(() => {
    document.title = "Profile | Network of American Mensa Member Experts";
  }, []);

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
      const industriesArray = industryData || [];
      // Sort industries alphabetically by name
      industriesArray.sort((a: any, b: any) => a.industry_name.localeCompare(b.industry_name));
      setIndustries(industriesArray);

    } catch (err: any) {
      setError(err.message || "Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    // Show success message
    setSuccess("Changes saved successfully!");
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Auto-dismiss success message after 5 seconds
    setTimeout(() => {
      setSuccess("");
    }, 5000);
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
        setError(""); // Clear any previous errors
        await apiRequest(`expertises/${item.id}/`, {method: "DELETE"});
        setSuccess("Expertise record deleted successfully!");
        // Auto-dismiss success message after 3 seconds
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } catch (err: any) {
        console.error("Failed to delete expertise:", err);
        setSuccess(""); // Clear any previous success messages
        setError("Error deleting expertise. Please try again.");
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
          {error && (
            <Alert color="danger" className="mb-3" toggle={() => setError("")}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert color="success" className="mb-3" style={{ fontWeight: '500' }} toggle={() => setSuccess("")}>
              ✓ {success}
            </Alert>
          )}
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
                <p className="text-muted small">
                  You can maintain up to three expertise offerings at a time, and at least
                  one must be saved for your profile to appear in the experts directory.
                </p>

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
                  {expertiseData.some((item) => item.id)
                    ? "Add Another Expertise"
                    : "Add Expertise"}{" "}
                  {expertiseData.length >= 3 ? "(Maximum 3)" : ""}
                </Button>
              </div>
              
              <div className="text-center mt-4">
                <Button 
                  color="primary" 
                  type="submit" 
                  form="edit-expert-form" 
                  size="lg"
                >
                  Save Expert Profile
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
