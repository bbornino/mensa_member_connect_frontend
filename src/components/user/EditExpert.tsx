// EditExpert.tsx
import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { useApiRequest } from "../../utils/useApiRequest";

interface ExpertFormData {
  occupation: string;
  background: string;
  availability_status?: string;
  show_contact_info?: boolean;
  // add any other fields from your Expert model
}

const EditExpert = ({ data, onSave }: { data: any; onSave: () => void }) => {
  const { apiRequest } = useApiRequest();
  const [formData, setFormData] = useState<ExpertFormData>(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev: ExpertFormData) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiRequest(`experts/${data.id}/`, {
      method: "PUT",
      body: JSON.stringify(formData),
    });

    onSave();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="occupation">Occupation</Label>
        <Input id="occupation" value={formData.occupation} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="background">Background</Label>
        <Input
          id="background"
          type="textarea"
          rows={3}
          value={formData.background}
          onChange={handleChange}
        />
      </FormGroup>
      <Button color="primary" type="submit">
        Save Expert Info
      </Button>
    </Form>
  );
};

export default EditExpert;
