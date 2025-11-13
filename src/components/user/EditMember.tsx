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
import {
  formatPhoneNumber,
  convertPhoneToE164,
  validatePhoneNumber,
} from "../../utils/phoneUtils";

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
  profile_photo?: File | string;
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
  profile_photo?: string;
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
    profile_photo: undefined, 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showMemberId, setShowMemberId] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [localGroups, setLocalGroups] = useState<{ id: number; group_name: string; group_number: string }[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

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
        phone: data.phone ? formatPhoneNumber(data.phone) : "",
        member_id: data.member_id?.toString() || "",
        local_group: data.local_group || "",
        role: data.role,
        status: data.status,
        profile_photo: data.profile_photo || undefined,
      });

      // If editing an existing photo, set preview
      if (data.profile_photo) {
        setPhotoPreview(`data:image/jpeg;base64,${data.profile_photo}`);
      }
    }
  }, [data]);

  useEffect(() => {
    const fetchLocalGroups = async () => {
      try {
        const response = await apiRequest("local_groups/");

        const groupsArray = (response.results || response).map((g: any) => ({
          id: g.id,
          group_name: g.group_name,
          group_number: g.group_number,
        }));

        setLocalGroups(groupsArray);
      } catch (err: any) {
        console.error("Failed to fetch local groups", err);
        setLocalGroups([]);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchLocalGroups();
  }, [apiRequest]);



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

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        setFormErrors((prev) => ({
          ...prev,
          profile_photo: "Image file size must be less than 5MB",
        }));
        // Clear the file input
        e.target.value = "";
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setFormErrors((prev) => ({
          ...prev,
          profile_photo: "Please upload a JPG, PNG, or GIF image",
        }));
        e.target.value = "";
        return;
      }

      // Clear any previous errors
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.profile_photo;
        return newErrors;
      });

      setFormData((prev) => ({ ...prev, profile_photo: file }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    // Validate phone number with detailed error messages
    const phoneValidation = validatePhoneNumber(formData.phone || "");
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error || "Please enter a valid phone number";
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
      const patchPayload: Partial<MemberFormData> = { ...formData };
      if (!patchPayload.password) delete patchPayload.password;
      if (!patchPayload.confirm_password) delete patchPayload.confirm_password;
      if (patchPayload.profile_photo) delete patchPayload.profile_photo; // photo goes separately
      
      // Convert phone number from formatted (555) 123-4567 to E.164 format +15551234567
      // The backend's DRFPhoneNumberField with region="US" should accept E.164 format
      // If it's already in E.164 format (starts with +), send it as-is
      if (patchPayload.phone) {
        const originalPhone = patchPayload.phone;
        // If already in E.164 format, use as-is
        if (originalPhone.startsWith('+')) {
          // Keep it as-is
        } else {
          // Convert from display format to E.164
          const convertedPhone = convertPhoneToE164(patchPayload.phone);
          if (convertedPhone === null) {
            // If conversion fails, remove phone from payload (let backend handle validation)
            delete patchPayload.phone;
            console.warn("Phone conversion failed, removing from payload:", originalPhone);
          } else {
            patchPayload.phone = convertedPhone;
          }
        }
      } else {
        // If phone is empty, don't send it (backend will keep existing value)
        delete patchPayload.phone;
      }


      // Prepare FormData for the photo (if one was selected)
      let photoRequest: Promise<any> = Promise.resolve(); // default: do nothing
      if (formData.profile_photo && formData.profile_photo instanceof File) {
        const formDataObj = new FormData();
        formDataObj.append("profile_photo", formData.profile_photo);
        photoRequest = apiRequest(`users/${data.id}/photo/`, {
          method: "POST",
          body: formDataObj,
        });
      }

      // Run PATCH and POST in parallel
      await Promise.all([
        apiRequest(`users/${data.id}/`, {
          method: "PATCH",
          body: JSON.stringify(patchPayload),
        }),
        photoRequest,
      ]);

      setSuccess("Profile updated successfully!");
      onSave();
    } catch (err: any) {
      console.error("Error updating profile:", err);
      // Extract error message from backend response
      let errorMessage = "Error updating profile";
      const fieldErrors: FormErrors = {};
      
      if (err.data) {
        // Backend validation errors
        const errorDetails = err.data;
        if (typeof errorDetails === 'object') {
          Object.entries(errorDetails).forEach(([field, messages]: [string, any]) => {
            const message = Array.isArray(messages) ? messages.join(', ') : String(messages);
            
            // Map backend field names to form field names
            if (field === 'phone') {
              fieldErrors.phone = message === 'Enter a valid phone number.' 
                ? 'Please enter a valid phone number. Make sure it is a real phone number (not all the same digits).'
                : message;
            } else {
              // Set field-specific errors
              (fieldErrors as any)[field] = message;
            }
            
            // Build general error message
            const fieldLabel = field === 'phone' ? 'Phone number' : field;
            errorMessage = `${fieldLabel}: ${message}`;
          });
        } else if (typeof errorDetails === 'string') {
          errorMessage = errorDetails;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Set field-specific errors if any
      if (Object.keys(fieldErrors).length > 0) {
        setFormErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
      
      setError(errorMessage);
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
              <Label htmlFor="member_id">
                Mensa Membership Number <span className="text-danger">*</span>
              </Label>
              {isAdminMode ? (
                <div className="input-group">
                  <Input
                    id="member_id"
                    name="member_id"
                    type={showMemberId ? "text" : "password"}
                    value={formData.member_id}
                    onChange={handleChange}
                    
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
                disabled={loadingGroups}
              >
                <option value="">Please select</option>
                {localGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.group_name} - {group.group_number}
                  </option>
                ))}
              </Input>
              <FormFeedback>{formErrors.local_group}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <FormGroup>
              <Label htmlFor="profile_photo">Profile Photo</Label>
              <div className="d-flex align-items-center gap-3">
                {photoPreview && (
                  <div>
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "2px solid #dee2e6",
                      }}
                    />
                  </div>
                )}
                <div className="flex-grow-1">
                  <Input
                    id="profile_photo"
                    name="profile_photo"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={handlePhotoChange}
                    invalid={!!formErrors.profile_photo}
                  />
                  <small className="text-muted d-block mt-1">
                    Upload a profile photo (JPG, PNG, or GIF, max 5MB)
                  </small>
                  {formErrors.profile_photo && (
                    <FormFeedback>{formErrors.profile_photo}</FormFeedback>
                  )}
                </div>
              </div>
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
            <Col md="6">
              <FormGroup>
                <Label htmlFor="role">
                  Role <span className="text-danger">*</span>
                </Label>
                <Input
                  id="role"
                  name="role"
                  type="select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
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
