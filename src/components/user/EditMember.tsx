import React, { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import { useApiRequest } from "../../utils/useApiRequest";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

interface EditMemberProps {
  data: Record<string, any>;
  onSave: () => void;
}

interface MemberFormData {
  username: string;
  email: string;
  password?: string;
  confirm_password?: string;
  first_name: string;
  last_name: string;
  city: string;
  state: string;
  phone: string;
  member_id: string;
  role?: string;
  status?: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  state?: string;
  general?: string;
}

const EditMember: React.FC<EditMemberProps> = ({ data, onSave }) => {
  const { apiRequest } = useApiRequest();

  const [formData, setFormData] = useState<MemberFormData>({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    city: "",
    state: "",
    phone: "",
    member_id: "",
    role: "",
    status: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        username: data.username || "",
        email: data.email || "",
        password: "",
        confirm_password: "",
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        city: data.city || "",
        state: data.state || "",
        phone: data.phone || "",
        member_id: data.member_id || "",
        role: data.role,
        status: data.status,
      });
    }
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, name, value } = e.target;
    const fieldName = id || name;
    
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    
    // Clear error when user starts typing
    if (formErrors[fieldName as keyof FormErrors]) {
      setFormErrors({
        ...formErrors,
        [fieldName]: undefined,
      });
    }
  };

  const handlePasswordToggle = () => setShowPassword((prev) => !prev);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^(\(\d{3}\)\s?|\d{3}[-\s]?)\d{3}[-\s]?\d{4}$/.test(phone);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.first_name?.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid US phone number";
    }

    if (formData.password && formData.password !== formData.confirm_password) {
      newErrors.password = "Passwords do not match";
    }

    if (!formData.state) {
      newErrors.state = "Please select your state";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const payload = { ...formData };
      // Don't send empty password to API
      if (!payload.password) delete payload.password;
      if (!payload.confirm_password) delete payload.confirm_password;

      await apiRequest(`users/${data.id}/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setSuccess("Profile updated successfully!");
      onSave();
    } catch (err: any) {
      setError(err.message || "Error updating profile");
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
              <Label htmlFor="first_name">
                First Name <span className="text-danger">*</span>
              </Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                invalid={!!formErrors.first_name}
              />
              <FormFeedback>{formErrors.first_name}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="last_name">
                Last Name <span className="text-danger">*</span>
              </Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                invalid={!!formErrors.last_name}
              />
              <FormFeedback>{formErrors.last_name}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="username">User Name</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                disabled
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="email">
                Email <span className="text-danger">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                invalid={!!formErrors.email}
              />
              <FormFeedback>{formErrors.email}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                invalid={!!formErrors.phone}
              />
              <FormFeedback>{formErrors.phone}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="member_id">Member ID</Label>
              <Input
                id="member_id"
                name="member_id"
                type="text"
                value={formData.member_id}
                onChange={handleChange}
                disabled
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="state">
                State <span className="text-danger">*</span>
              </Label>
              <Input
                id="state"
                name="state"
                type="select"
                value={formData.state}
                onChange={handleChange}
                invalid={!!formErrors.state}
              >
                <option value="">Select State...</option>
                {US_STATES.map((abbr) => (
                  <option key={abbr} value={abbr}>
                    {abbr}
                  </option>
                ))}
              </Input>
              <FormFeedback>{formErrors.state}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <div className="input-group">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                  invalid={!!formErrors.password}
                />
                <span
                  className="input-group-text"
                  onClick={handlePasswordToggle}
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              {formErrors.password && (
                <div className="text-danger small mt-1">{formErrors.password}</div>
              )}
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type={showPassword ? "text" : "password"}
                value={formData.confirm_password}
                onChange={handleChange}
              />
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
              "Save Basic Information"
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditMember;
