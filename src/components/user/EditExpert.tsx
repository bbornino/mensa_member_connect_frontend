import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Spinner,
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
}

const EditExpert: React.FC<EditExpertProps> = ({ data, onSave }) => {
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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch industries list
    const fetchIndustries = async () => {
      try {
        const result = await apiRequest("industries/");
        if (result) {
          setIndustries(result);
        }
      } catch (err) {
        console.error("Failed to fetch industries:", err);
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
    setIsSaving(true);

    try {
      await apiRequest(`users/${data.id}/`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });

      setSuccess("Expert profile updated successfully!");
      onSave();
    } catch (err: any) {
      setError(err.message || "Error updating expert profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-3">
      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
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
                {industries.map((ind) => (
                  <option key={ind.id} value={ind.id}>
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

        <div className="text-center mt-4">
          <Button color="primary" type="submit" size="lg" disabled={isSaving}>
            {isSaving ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              "Save Expert Profile"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditExpert;
