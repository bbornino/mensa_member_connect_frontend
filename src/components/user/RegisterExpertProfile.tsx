import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Form,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import { useApiRequest } from "../../utils/useApiRequest";
import { useAuth } from "../../context/AuthContext";
import EditExpertise from "./EditExpertise";
import { analytics } from "../../utils/analytics";

interface ExpertFormData {
  occupation: string;
  industry: number | null;
  background: string;
  availability_status?: string;
  show_contact_info?: boolean;
}

const RegisterExpertProfile: React.FC = () => {
  const { apiRequest } = useApiRequest();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ExpertFormData>({
    occupation: "",
    industry: null,
    background: "",
    availability_status: "available",
    show_contact_info: false,
  });

  const [expertiseData, setExpertiseData] = useState<any[]>([{}]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    document.title = "Expert Profile Setup | Network of American Mensa Member Experts";
    
    // Redirect if not logged in
    if (!user) {
      navigate("/login");
      return;
    }

    // Fetch industries
    const fetchIndustries = async () => {
      try {
        const response = await apiRequest("industries/");
        const industryArray = (response.results || response).map((ind: any) => ({
          id: ind.id,
          industry_name: ind.industry_name,
        }));
        industryArray.sort((a: any, b: any) => a.industry_name.localeCompare(b.industry_name));
        setIndustries(industryArray);
      } catch (err) {
        console.error("Failed to fetch industries:", err);
        setIndustries([]);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchIndustries();
  }, [apiRequest, user, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, name, value, type } = e.target;
    const fieldName = id || name;
    const checked = (e.target as HTMLInputElement).checked;

    const processedValue = fieldName === "industry" 
      ? (value ? parseInt(value, 10) : null)
      : value;

    setFormData((prev: ExpertFormData) => ({
      ...prev,
      [fieldName]: type === "checkbox" ? checked : processedValue,
    }));
  };

  const handleExpertiseChange = (index: number, data: Record<string, any>) => {
    setExpertiseData(prev => {
      const newData = [...prev];
      newData[index] = data;
      return newData;
    });
  };

  const addExpertise = () => {
    if (expertiseData.length >= 3) {
      return;
    }
    setExpertiseData(prev => [...prev, {}]);
  };

  const removeExpertise = (index: number) => {
    setExpertiseData(prev => prev.filter((_, i) => i !== index));
  };

  const handleSkip = () => {
    // Navigate directly to completion page without saving
    navigate("/register/complete");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!user) {
        setError("You must be logged in to save your profile.");
        setIsLoading(false);
        return;
      }

      // Prepare data for API
      const apiData: any = {
        ...formData,
        industry_id: formData.industry || null,
      };
      delete apiData.industry;

      // Save expert profile data (even if empty - that's allowed)
      await apiRequest(`users/${user.id}/`, {
        method: "PATCH",
        body: JSON.stringify(apiData),
      });

      // Filter out blank expertise records (those without what_offering)
      const nonBlankExpertise = expertiseData.filter((expertise) => {
        const whatOffering = expertise.what_offering?.trim() || "";
        return whatOffering.length > 0;
      });

      // Save expertise data (only non-blank ones)
      for (const expertise of nonBlankExpertise) {
        const payload = {
          ...expertise,
          user: user.id,
        };
        await apiRequest("expertises/", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      // Track analytics - only track if there's actual data
      const hasData = !!(formData.occupation || formData.background || formData.industry || nonBlankExpertise.length > 0);
      if (hasData) {
        analytics.trackExpertProfileUpdate('create', true);
      }
      
      // Navigate to completion page
      navigate("/register/complete");
    } catch (err: any) {
      console.error("Error saving expert profile:", err);
      setError(err.message || "Error saving expert profile. Please try again.");
      analytics.trackExpertProfileUpdate('create', false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <Container className="centered-container">
        <div className="text-center p-5">
          <p>Loading...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="centered-container">
      <Card className="text-dark bg-light m-3 card-wide">
        <CardTitle tag="h5" className="p-3 mb-0">
          <strong>Set Up Your Expert Profile (Optional)</strong>
        </CardTitle>
        <CardBody>
          <p className="text-muted mb-4">
            You can set up your expert profile now, or skip this step and complete it later from your profile page.
            Expert profiles help other Mensa members find and connect with you based on your expertise.
          </p>

          {error && (
            <Alert color="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Form id="expert-profile-form" onSubmit={handleSubmit}>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    type="text"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="e.g., Software Engineer, Doctor, Teacher"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    name="industry"
                    type="select"
                    value={formData.industry || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Industry...</option>
                    {industries.map((ind, idx) => (
                      <option key={ind.id ?? idx} value={ind.id ?? ""}>
                        {ind.industry_name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label htmlFor="background">Background</Label>
              <Input
                id="background"
                name="background"
                type="textarea"
                rows="3"
                value={formData.background}
                onChange={handleChange}
                placeholder="Tell us about your professional background and experience..."
              />
            </FormGroup>

            <Row>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="availability_status">Availability</Label>
                  <Input
                    id="availability_status"
                    name="availability_status"
                    type="select"
                    value={formData.availability_status}
                    onChange={handleChange}
                  >
                    <option value="available">Available</option>
                    <option value="not_available">Not Available</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup check className="mt-4">
                  <Input
                    id="show_contact_info"
                    name="show_contact_info"
                    type="checkbox"
                    checked={formData.show_contact_info}
                    onChange={handleChange}
                  />
                  <Label check htmlFor="show_contact_info">
                    Show contact information to other members
                  </Label>
                </FormGroup>
              </Col>
            </Row>

            <div className="mt-4">
              <hr />
              <h6>
                <strong>Expertise Records (Optional)</strong>
              </h6>
              <p className="text-muted small">
                You can add up to three expertise offerings. At least one must be saved for your profile to appear in the experts directory.
              </p>

              {expertiseData.map((item, idx) => (
                <EditExpertise
                  key={idx}
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
                type="button"
              >
                {expertiseData.some((item) => item.id)
                  ? "Add Another Expertise"
                  : "Add Expertise"}{" "}
                {expertiseData.length >= 3 ? "(Maximum 3)" : ""}
              </Button>
            </div>
          </Form>
        </CardBody>
        <CardFooter>
          <div className="d-flex gap-2 justify-content-between">
            <Button 
              color="secondary" 
              onClick={handleSkip}
              disabled={isLoading}
              type="button"
            >
              Skip for Now
            </Button>
            <Button 
              color="primary" 
              type="submit"
              form="expert-profile-form"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Expert Profile"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default RegisterExpertProfile;
