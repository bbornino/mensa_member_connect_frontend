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

interface EditMemberProps {
  data: Record<string, any>;
  onSave: () => void;
  isAdminMode?: boolean;
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
  local_group: string;
  role?: string;
  status?: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  member_id?: string;
  city?: string;
  state?: string;
  local_group?: string;
  password?: string;
  general?: string;
}

const EditMember: React.FC<EditMemberProps> = ({ data, onSave, isAdminMode = false }) => {
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
    local_group: "",
    role: "",
    status: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showMemberId, setShowMemberId] = useState(false);
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
        local_group: data.local_group || "",
        role: data.role,
        status: data.status,
      });
    }
  }, [data]);

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
    const { id, name, value } = e.target;
    const fieldName = id || name;
    
    // Auto-format phone number
    const newValue = fieldName === 'phone' ? formatPhoneNumber(value) : value;
    
    setFormData((prev) => ({ ...prev, [fieldName]: newValue }));
    
    // Clear error when user starts typing
    if (formErrors[fieldName as keyof FormErrors]) {
      setFormErrors({
        ...formErrors,
        [fieldName]: undefined,
      });
    }
  };

  const handlePasswordToggle = () => setShowPassword((prev) => !prev);
  const handleMemberIdToggle = () => setShowMemberId((prev) => !prev);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // Strict format: (555) 123-4567
  const validatePhone = (phone: string) => /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);
  const validateMemberId = (memberId: string) => /^\d+$/.test(memberId);

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

    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number in the format: (555) 123-4567";
    }

    if (!formData.member_id?.trim()) {
      newErrors.member_id = "Member ID is required";
    } else if (!validateMemberId(formData.member_id)) {
      newErrors.member_id = "Member ID must be numeric";
    }

    if (!formData.city?.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state) {
      newErrors.state = "Please select your state";
    }

    if (!formData.local_group) {
      newErrors.local_group = "Please select your local group";
    }

    if (formData.password && formData.password !== formData.confirm_password) {
      newErrors.password = "Passwords do not match";
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
              <Label htmlFor="phone">
                Phone Number <span className="text-danger">*</span>
              </Label>
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
              <Label htmlFor="member_id">
                Member ID <span className="text-danger">*</span>
              </Label>
              {isAdminMode ? (
                <div className="input-group">
                  <Input
                    id="member_id"
                    name="member_id"
                    type={showMemberId ? "text" : "password"}
                    value={formData.member_id}
                    onChange={handleChange}
                    disabled
                    invalid={!!formErrors.member_id}
                  />
                  <span
                    className="input-group-text"
                    onClick={handleMemberIdToggle}
                    style={{ cursor: "pointer" }}
                    title={showMemberId ? "Hide Member ID" : "Show Member ID"}
                  >
                    {showMemberId ? "👁️" : "👁️‍🗨️"}
                  </span>
                </div>
              ) : (
                <Input
                  id="member_id"
                  name="member_id"
                  type="text"
                  value={formData.member_id}
                  onChange={handleChange}
                  disabled
                  invalid={!!formErrors.member_id}
                />
              )}
              <FormFeedback>{formErrors.member_id}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="city">
                City <span className="text-danger">*</span>
              </Label>
              <Input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                invalid={!!formErrors.city}
              />
              <FormFeedback>{formErrors.city}</FormFeedback>
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
          <Col md="12">
            <FormGroup>
              <Label htmlFor="local_group">
                Local Group <span className="text-danger">*</span>
              </Label>
              <Input
                id="local_group"
                name="local_group"
                type="select"
                value={formData.local_group}
                onChange={handleChange}
                invalid={!!formErrors.local_group}
              >
                <option value="">Please select</option>
                {LOCAL_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </Input>
              <FormFeedback>{formErrors.local_group}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>

        {isAdminMode && (
          <Row>
            <Col md="6">
              <FormGroup>
                <Label htmlFor="status">
                  Status <span className="text-danger">*</span>
                </Label>
                <Input
                  id="status"
                  name="status"
                  type="select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
        )}

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
