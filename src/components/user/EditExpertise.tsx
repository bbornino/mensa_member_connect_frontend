import React, { useState} from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { useApiRequest } from "../../utils/useApiRequest";

interface EditExpertiseProps {
  data: Record<string, any>;
  onSave: () => void;
}

const EditExpertise: React.FC<EditExpertiseProps> = ({ data, onSave }) => {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (!formData.id) throw new Error("No expertise ID provided");

      const result = await apiRequest(`expertises/${formData.id}/`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (!result) throw new Error("Update failed");

      setSuccess("Expertise updated successfully!");
      onSave();
    } catch (err: any) {
      setError(err.message || "Error saving expertise.");
    }
  };

  return (
    <Card className="text-dark bg-light m-3 card-wide">
      <Form onSubmit={handleSubmit}>
        <CardBody>
          <FormGroup>
            <Label htmlFor="what_offering">What Offering</Label>
            <Input
              id="what_offering"
              type="textarea"
              value={formData.what_offering}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="who_would_benefit">Who Would Benefit</Label>
            <Input
              id="who_would_benefit"
              type="textarea"
              value={formData.who_would_benefit}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="why_choose_you">Why Choose You</Label>
            <Input
              id="why_choose_you"
              type="textarea"
              value={formData.why_choose_you}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="skills_not_offered">Skills Not Offered</Label>
            <Input
              id="skills_not_offered"
              type="textarea"
              value={formData.skills_not_offered}
              onChange={handleChange}
            />
          </FormGroup>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
        </CardBody>

        <CardFooter>
          <Button color="primary" type="submit" className="w-100">
            Save Expertise
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
};

export default EditExpertise;
