import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Spinner,
} from "reactstrap";
import { useApiRequest } from "../../utils/useApiRequest";

interface EditExpertiseProps {
  data: Record<string, any>;
  onSave: () => void;
  index?: number;
  onRemove?: () => void;
  showRemove?: boolean;
}

const EditExpertise: React.FC<EditExpertiseProps> = ({
  data,
  onSave,
  index = 0,
  onRemove,
  showRemove = false,
}) => {
  const { apiRequest } = useApiRequest();

  const [formData, setFormData] = useState({
    id: data.id || null,
    what_offering: data.what_offering || "",
    who_would_benefit: data.who_would_benefit || "",
    why_choose_you: data.why_choose_you || "",
    skills_not_offered: data.skills_not_offered || "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, name, value } = e.target;
    const fieldName = id || name;
    
    // Remove the index suffix if present (e.g., what_offering_0 -> what_offering)
    const cleanFieldName = fieldName.replace(/_\d+$/, '');
    
    setFormData((prev) => ({ ...prev, [cleanFieldName]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      if (formData.id) {
        // Update existing expertise
        await apiRequest(`expertises/${formData.id}/`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        setSuccess("Expertise updated successfully!");
      } else {
        // Create new expertise
        const result = await apiRequest("expertises/", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        
        if (result) {
          setFormData(prev => ({ ...prev, id: result.id }));
          setSuccess("Expertise created successfully!");
        }
      }

      onSave();
    } catch (err: any) {
      setError(err.message || "Error saving expertise.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="mb-3">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">Expertise #{index + 1}</h6>
          {showRemove && onRemove && (
            <Button color="danger" size="sm" onClick={onRemove}>
              Remove
            </Button>
          )}
        </div>

        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor={`what_offering_${index}`}>
              What skills, information, or mentorship are you offering to other Mensa members?{" "}
              <span className="text-danger">*</span>
            </Label>
            <Input
              id={`what_offering_${index}`}
              name="what_offering"
              type="textarea"
              rows="2"
              value={formData.what_offering}
              onChange={handleChange}
              placeholder="Describe what you can offer..."
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor={`who_would_benefit_${index}`}>
              Who do you think could benefit from this information?
            </Label>
            <Input
              id={`who_would_benefit_${index}`}
              name="who_would_benefit"
              type="textarea"
              rows="2"
              value={formData.who_would_benefit}
              onChange={handleChange}
              placeholder="Describe your target audience..."
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor={`why_choose_you_${index}`}>
              Tell us about yourself / why a Mensa member should choose you.
            </Label>
            <Input
              id={`why_choose_you_${index}`}
              name="why_choose_you"
              type="textarea"
              rows="2"
              value={formData.why_choose_you}
              onChange={handleChange}
              placeholder="What makes you unique or qualified..."
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor={`skills_not_offered_${index}`}>
              What's not offered
            </Label>
            <Input
              id={`skills_not_offered_${index}`}
              name="skills_not_offered"
              type="textarea"
              rows="2"
              value={formData.skills_not_offered}
              onChange={handleChange}
              placeholder="What you don't offer or areas outside your expertise..."
            />
          </FormGroup>

          <div className="text-center">
            <Button color="primary" type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Save Expertise"
              )}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default EditExpertise;
