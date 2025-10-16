import React, { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import {
  Row,
  Col,
  Form,
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  FormGroup,
  Label,
  Input,
  Button,
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
  password?: string;          // optional, may be empty
  confirm_password?: string;  // optional, may be empty
  first_name: string;
  last_name: string;
  city: string;
  state: string;
  phone: string;
  member_id: string;
  role?: string;              // optional
  status?: string;            // optional
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (data) {
      setFormData({
        username: data.username || "",
        email: data.email || "",
        password: "",            // always empty
        confirm_password: "",    // always empty
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        city: data.city || "",
        state: data.state || "",
        phone: data.phone || "",
        member_id: data.member_id || "",
        role: data.role,         // optional
        status: data.status,     // optional
      });
    }
  }, [data]);  // run whenever data changes

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePasswordToggle = () => setShowPassword((prev) => !prev);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^(\(\d{3}\)\s?|\d{3}[-\s]?)\d{3}[-\s]?\d{4}$/.test(phone);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(formData.email)) return setError("Please enter a valid email address.");
    if (!validatePhone(formData.phone)) return setError("Please enter a valid US phone number.");
    if (formData.password && formData.password !== formData.confirm_password)
      return setError("Passwords do not match.");
    if (!formData.state) return setError("Please select your state.");

    try {
      const payload = { ...formData };
      // Don't send empty password to API
      if (!payload.password) delete payload.password;
      if (!payload.confirm_password) delete payload.confirm_password;

      await apiRequest(`users/${data.id}/`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setSuccess("Profile updated successfully!");
      onSave();
    } catch (err: any) {
      setError(err.message || "Error updating profile");
    }
  };

  return (
    <Card className="text-dark bg-light m-3 card-wide">
      <Form onSubmit={handleSubmit}>
        <CardTitle tag="h5" className="p-3 mb-0"><strong>Edit Member</strong></CardTitle>
        <CardBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" type="text" value={formData.first_name} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" type="text" value={formData.last_name} onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label htmlFor="username">User Name</Label>
                <Input id="username" type="text" value={formData.username} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label htmlFor="member_id">Member ID</Label>
                <Input id="member_id" type="text" value={formData.member_id} onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label htmlFor="city">City</Label>
                <Input id="city" type="text" value={formData.city} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label htmlFor="state">State</Label>
                <Input id="state" type="select" value={formData.state} onChange={handleChange}>
                  <option value="">Select State...</option>
                  {US_STATES.map((abbr) => <option key={abbr} value={abbr}>{abbr}</option>)}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <div className="input-group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span className="input-group-text" onClick={handlePasswordToggle} style={{ cursor: "pointer" }}>
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
        </CardBody>

        <CardFooter>
          <Button color="primary" type="submit" className="w-100">Save Member</Button>
        </CardFooter>
      </Form>
    </Card>
  );
};

export default EditMember;
