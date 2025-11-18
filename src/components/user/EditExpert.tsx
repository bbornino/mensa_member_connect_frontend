import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import { useApiRequest } from "../../utils/useApiRequest";

interface ExpertFormData {
  occupation: string;
  industry: number | null;
  background: string;
  availability_status?: string;
  show_contact_info?: boolean;
}

interface EditExpertProps {
  data: any;
  onSave: () => void;
  expertiseData: any[];
  userId: number;
}

const EditExpert: React.FC<EditExpertProps> = ({ data, onSave, expertiseData, userId }) => {
  const { apiRequest } = useApiRequest();
  const [formData, setFormData] = useState<ExpertFormData>({
    occupation: data.occupation || "",
    industry: data.industry?.id || data.industry || null,
    background: data.background || "",
    availability_status: data.availability_status || "available",
    show_contact_info: data.show_contact_info || false,
  });

  const [industries, setIndustries] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await apiRequest("industries/");
        const industryArray = (response.results || response).map((ind: any) => ({
          id: ind.id,
          industry_name: ind.industry_name,
        }));
        // Sort industries alphabetically by name
        industryArray.sort((a: any, b: any) => a.industry_name.localeCompare(b.industry_name));
        setIndustries(industryArray);
      } catch (err) {
        console.error("Failed to fetch industries:", err);
        setIndustries([]);
      }
    };

    fetchIndustries();
  }, [apiRequest]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, name, value, type } = e.target;
    const fieldName = id || name;
    const checked = (e.target as HTMLInputElement).checked;

    // Convert industry value to number since it's a foreign key
    const processedValue = fieldName === "industry" 
      ? (value ? parseInt(value, 10) : null)
      : value;

    setFormData((prev: ExpertFormData) => ({
      ...prev,
      [fieldName]: type === "checkbox" ? checked : processedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Prepare data for API - use industry_id instead of industry
      const apiData: any = {
        ...formData,
        industry_id: formData.industry || null,
      };
      delete apiData.industry;
      
      // Allow empty occupation (convert empty string to empty string, which is fine)
      if (apiData.occupation === "") {
        apiData.occupation = "";
      }

      // Save expert profile data
      await apiRequest(`users/${data.id}/`, {
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
        if (expertise.id) {
          // Update existing expertise
          await apiRequest(`expertises/${expertise.id}/`, {
            method: "PUT",
            body: JSON.stringify(expertise),
          });
        } else {
          // Create new expertise
          const payload = {
            ...expertise,
            user: userId,
          };
          await apiRequest("expertises/", {
            method: "POST",
            body: JSON.stringify(payload),
          });
        }
      }

      // Delete any existing expertise records that are now blank
      for (const expertise of expertiseData) {
        const whatOffering = expertise.what_offering?.trim() || "";
        if (expertise.id && whatOffering.length === 0) {
          // This expertise exists in DB but is now blank, delete it
          try {
            await apiRequest(`expertises/${expertise.id}/`, {
              method: "DELETE",
            });
          } catch (err) {
            console.error("Failed to delete blank expertise:", err);
            // Continue with other operations even if deletion fails
          }
        }
      }

      // Call onSave which will show success message in parent
      onSave();
    } catch (err: any) {
      setError(err.message || "Error updating expert profile");
    }
  };

  return (
    <div className="mt-3">
      {error && (
        <Alert color="danger" className="mb-3">
          {error}
        </Alert>
      )}
      {success && (
        <Alert color="success" className="mb-3" style={{ fontWeight: '500' }}>
          ✓ {success}
        </Alert>
      )}

      <Form id="edit-expert-form" onSubmit={handleSubmit}>
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
      </Form>
    </div>
  );
};

export default EditExpert;
