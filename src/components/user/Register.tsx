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

const LOCAL_GROUPS = [
  "Arkansas Mensa",
  "Baton Rouge Mensa",
  "Bluegrass Mensa",
  "Boston Mensa",
  "Boulder/Front Range Mensa",
  "Broward Mensa",
  "Central Alabama Mensa",
  "Central Florida Mensa",
  "Central Indiana Mensa",
  "Central Iowa Mensa",
  "Central New Jersey Mensa",
  "Central New York Mensa",
  "Central Oklahoma Mensa",
  "Central Pennsylvania Mensa",
  "Central South Carolina Mensa",
  "Central Texas Mensa",
  "Channel Islands Mensa",
  "Charlotte - Blue Ridge Mensa",
  "Chattanooga Mensa",
  "Chicago Area Mensa",
  "Cincinnati Area Mensa",
  "Cleveland Area Mensa",
  "Coastal Carolina Mensa",
  "Columbia River Mensa",
  "Columbus Area Mensa",
  "Connecticut/Western Massachusetts Mensa",
  "Dayton Area Mensa",
  "Delaware Mensa",
  "Delaware Valley Mensa",
  "Denver Mensa",
  "East Central Ohio Mensa",
  "Eastern Oklahoma Mensa",
  "Eastern Washington/Northern Idaho/Montana",
  "French Broad Mensa",
  "Greater Los Angeles Area Mensa",
  "Greater New York Mensa",
  "Greater Phoenix Mensa",
  "Gulf Coast Mensa",
  "Heart of Illinois Mensa",
  "High Mountain Mensa",
  "Iowa-Illinois Mensa",
  "Kansas Sunflower Mensa",
  "Kentuckiana Mensa",
  "Lehigh Pocono Mensa",
  "Lubbock Mensa",
  "Maine Mensa",
  "Manasota Mensa",
  "Maryland Mensa",
  "Maumee Valley Mensa",
  "Memphis Mensa",
  "Mensa 76",
  "Mensa Alaska",
  "Mensa Hawaii",
  "Mensa In Georgia",
  "Mensa of Eastern North Carolina",
  "Mensa of Jacksonville",
  "Mensa of Northeastern New York",
  "Mensa of the Southern Tier of NY",
  "Mensa of Western Washington",
  "Mensa of Wisconsin",
  "Metropolitan Washington Mensa",
  "Miami Mensa",
  "Mid-America Mensa",
  "Middle Tennessee Mensa",
  "Mid-Hudson Mensa",
  "Mid-Michigan Mensa",
  "Minnesota Mensa",
  "Mississippi Mensa",
  "Missouri Ozarks Mensa",
  "Monterey County Mensa",
  "Montgomery/Wiregrass Mensa",
  "Nebraska-Western Iowa Mensa",
  "New Hampshire Mensa",
  "New Mexico Mensa",
  "New Orleans Mensa",
  "No group assigned",
  "North Alabama Mensa",
  "North Dakota Mensa",
  "North Florida Mensa",
  "North Texas Mensa",
  "Northeast Indiana Mensa",
  "Northern Louisiana Mensa",
  "Northern Michigan Mensa",
  "Northern Nevada Mensa",
  "Northern New Jersey Mensa",
  "Northwest Florida Mensa",
  "Orange County Mensa",
  "Oregon Mensa",
  "Palm Beach Area Mensa",
  "Paso del Norte Mensa",
  "Permian Basin Mensa",
  "Piedmont Area Mensa",
  "Plains and Peaks Mensa",
  "Redwood Empire Mensa",
  "Rhode Island Mensa",
  "Richmond Area Mensa",
  "Rochester Area Mensa",
  "Sacramento Regional Mensa",
  "San Diego Mensa",
  "San Francisco Regional Mensa",
  "Sangamon Valley Mensa",
  "Savannah Area Mensa of Georgia",
  "Smoky Mountain Mensa",
  "South Coast Mensa",
  "South Dakota Mensa",
  "South Mississippi Mensa",
  "South Texas Mensa",
  "Southeast Michigan Mensa",
  "Southern Connecticut Mensa",
  "Southern Idaho Mensa",
  "Southern Nevada Mensa",
  "Southwest by South Florida Mensa",
  "Space Coast Area Mensa",
  "St. Louis Area Mensa",
  "Tallahassee Area  Mensa",
  "Tampa Bay Mensa",
  "Thomas Jefferson Mensa",
  "Tidewater Mensa",
  "Triad Mensa",
  "Tucson Mensa",
  "Upper East Tennessee Mensa",
  "Utah Mensa",
  "Vandalia Mensa",
  "Vermont Mensa",
  "Western Michigan Mensa",
  "Western New York Mensa",
  "Western Pennsylvania Mensa",
  "Wyoming Mountain Mensa",
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
    local_group: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register - MENSA Tracker";
  }, []);

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedNumbers = numbers.slice(0, 10);
    
    // Format based on length
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `(${limitedNumbers.slice(0, 3)}) ${limitedNumbers.slice(3)}`;
    } else {
      return `(${limitedNumbers.slice(0, 3)}) ${limitedNumbers.slice(3, 6)}-${limitedNumbers.slice(6)}`;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    // Auto-format phone number
    if (id === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [id]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handlePasswordToggle = () => setShowPassword((prev) => !prev);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Strict format: (555) 123-4567
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateMemberId = (memberId: string): boolean => {
    // Must be numeric (only digits)
    const memberIdRegex = /^\d+$/;
    return memberIdRegex.test(memberId);
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check all required fields
    if (!formData.first_name.trim()) {
      setError("First name is required.");
      return;
    }

    if (!formData.last_name.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!formData.username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError("Please enter a valid phone number in the format: (555) 123-4567");
      return;
    }

    if (!formData.member_id.trim()) {
      setError("Member ID is required.");
      return;
    }

    if (!validateMemberId(formData.member_id)) {
      setError("Member ID must be numeric.");
      return;
    }

    if (!formData.city.trim()) {
      setError("City is required.");
      return;
    }

    if (!formData.state) {
      setError("Please select your state.");
      return;
    }

    if (!formData.local_group) {
      setError("Please select your local group.");
      return;
    }

    if (!formData.password) {
      setError("Password is required.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
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
                  <Label htmlFor="first_name">
                    First Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label htmlFor="last_name">
                    Last Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label htmlFor="username">
                    User Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label htmlFor="email">
                    Email <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label htmlFor="phone">
                    Phone Number <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label htmlFor="member_id">
                    Member ID <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="member_id"
                    type="text"
                    value={formData.member_id}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label htmlFor="city">
                    City <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label htmlFor="state">
                    State <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="state"
                    type="select"
                    value={formData.state}
                    onChange={handleChange}
                    required
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
              <Col md={12}>
                <FormGroup>
                  <Label htmlFor="local_group">
                    Local Group <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="local_group"
                    type="select"
                    value={formData.local_group}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Please select</option>
                    {LOCAL_GROUPS.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label htmlFor="password">
                    Password <span className="text-danger">*</span>
                  </Label>
                  <div className="input-group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
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
                  <Label htmlFor="confirm_password">
                    Confirm Password <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="confirm_password"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
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
