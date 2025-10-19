import React, { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/constants";
import {
  Container,
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
} from "reactstrap";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];


async function registerUser(userData: Record<string, any>) {
  const response = await fetch(`${API_BASE_URL}users/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Registration failed");
  }

  return response.json();
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
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
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register - MENSA Tracker";
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePasswordToggle = () => setShowPassword((prev) => !prev);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\(\d{3}\)\s?|\d{3}[-\s]?)\d{3}[-\s]?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError("Please enter a valid US phone number.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.state) {
      setError("Please select your state.");
      return;
    }

    const isRegistered = await registerUser(formData);
    if (!isRegistered) {
      setError("Registration failed. Please try again.");
      return;
    }

    setSuccess("Registration successful! Redirecting...");
    setTimeout(() => navigate("/experts"), 1000);
  };

  return (
    <Container className="centered-container">
      <Form onSubmit={handleRegister}>
        <Card className="text-dark bg-light m-3 card-wide">
          <CardTitle tag="h5" className="p-3 mb-0">
            <strong>Register</strong>
          </CardTitle>

          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label htmlFor="username">User Name</Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label htmlFor="member_id">Member ID</Label>
                  <Input
                    id="member_id"
                    type="text"
                    value={formData.member_id}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    type="select"
                    value={formData.state}
                    onChange={handleChange}
                  >
                    <option value="">Select State...</option>
                    {US_STATES.map((abbr) => (
                      <option key={abbr} value={abbr}>
                        {abbr}
                      </option>
                    ))}
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
                    <span
                      className="input-group-text"
                      onClick={handlePasswordToggle}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </span>
                  </div>
                </FormGroup>
              </Col>
              <Col>
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
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </CardFooter>
        </Card>
      </Form>
    </Container>
  );
};

export default Register;
