import React, { useState } from "react";
import type { ChangeEvent } from "react";
import {
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

interface EditExpertiseProps {
  data: Record<string, any>;
  index?: number;
  onRemove?: () => void;
  showRemove?: boolean;
  onChange?: (index: number, data: Record<string, any>) => void;
  industries: any[];
}

const EditExpertise: React.FC<EditExpertiseProps> = ({
  data,
  index = 0,
  onRemove,
  showRemove = false,
  onChange,
  industries,
}) => {
  const [formData, setFormData] = useState({
    id: data.id || null,
    area_of_expertise: data.area_of_expertise || "",
    what_offering: data.what_offering || "",
    who_would_benefit: data.who_would_benefit || "",
    why_choose_you: data.why_choose_you || "",
    skills_not_offered: data.skills_not_offered || "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, name, value } = e.target;
    const fieldName = id || name;
    
    // Remove the index suffix if present (e.g., what_offering_0 -> what_offering)
    const cleanFieldName = fieldName.replace(/_\d+$/, '');
    
    const newFormData = { ...formData, [cleanFieldName]: value };
    setFormData(newFormData);
    
    // Notify parent component of changes
    if (onChange) {
      onChange(index, newFormData);
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

        <div>
          <FormGroup>
            <Label htmlFor={`area_of_expertise_${index}`}>
              Area of Expertise
            </Label>
            <Input
              id={`area_of_expertise_${index}`}
              name="area_of_expertise"
              type="select"
              value={formData.area_of_expertise}
              onChange={handleChange}
            >
              <option value="">Select an industry...</option>
              {industries.map((industry) => (
                <option key={industry.id} value={industry.id}>
                  {industry.industry_name}
                </option>
              ))}
            </Input>
          </FormGroup>

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
        </div>
      </CardBody>
    </Card>
  );
};

export default EditExpertise;
