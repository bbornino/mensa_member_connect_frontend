import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { customFetch } from "../../utils/customFetch";
import { API_BASE_URL } from "../../utils/constants";
import {
  Container,
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Row,
  Col,
  Badge,
  Button,
  Spinner,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";

interface UserDetail {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  member_id: number;
  city: string;
  state: string;
  phone: string;
  role: string;
  status: string;
  date_joined: string;
  local_group: {
    id: number;
    group_name: string;
    city: string;
    state: string;
  } | null;
}

interface Expert {
  id: number;
  occupation: string;
  industry: {
    id: number;
    industry_name: string;
  } | null;
  background: string;
  availability_status: string;
  show_contact_info: boolean;
  photo?: string;
  expertise?: {
    what_offering: string;
    who_would_benefit: string;
    why_choose_you: string;
    skills_not_offered: string;
  }[];
}

interface ConnectionRequestForm {
  message: string;
  preferred_contact_method: string;
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [expert, setExpert] = useState<Expert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<ConnectionRequestForm>({
    message: "",
    preferred_contact_method: ""
  });
  const [formErrors, setFormErrors] = useState<{ message?: string }>({});

  // Demo data for testing UI
  const demoUser: UserDetail = {
    id: 1,
    username: "john_doe",
    email: "john.doe@example.com",
    first_name: "John",
    last_name: "Doe",
    member_id: 123456,
    city: "New York",
    state: "NY",
    phone: "(555) 123-4567",
    role: "member",
    status: "active",
    date_joined: "2023-01-15T10:30:00Z",
    local_group: {
      id: 1,
      group_name: "New York City",
      city: "New York",
      state: "NY"
    }
  };

  const demoExpert: Expert = {
    id: 1,
    occupation: "Software Engineer",
    industry: { id: 1, industry_name: "Technology" },
    background: "Senior software engineer with 10+ years of experience in full-stack development, specializing in React, Python, and cloud technologies. I have worked at both startups and Fortune 500 companies, leading teams and mentoring junior developers.",
    availability_status: "available",
    show_contact_info: true,
    photo: "/test-photos/1.png",
    expertise: [
      {
        what_offering: "Software development mentorship and career guidance",
        who_would_benefit: "Junior developers, career changers, and students looking to break into tech",
        why_choose_you: "I have successfully mentored 20+ developers and helped them land their dream jobs. I understand both the technical and career aspects of software development.",
        skills_not_offered: "I do not offer help with hardware engineering, game development, or mobile app development."
      },
      {
        what_offering: "Technical interview preparation and coding practice",
        who_would_benefit: "Software engineers preparing for technical interviews at FAANG companies",
        why_choose_you: "I have conducted 100+ technical interviews and know exactly what companies are looking for. I can help you practice and improve your problem-solving skills.",
        skills_not_offered: "I do not offer help with system design interviews or behavioral interviews."
      }
    ]
  };

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!id) {
        setError("Invalid user ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // For demo purposes, use demo data. Later this will fetch from API
        setUser(demoUser);
        setExpert(demoExpert);

        // Real API calls would look like this:
        // const userData = await customFetch(`users/${id}/`, { method: "GET" }, null, null, () => {});
        // setUser(userData);
        // 
        // const expertData = await customFetch(`experts/?user=${id}`, { method: "GET" }, null, null, () => {});
        // if (expertData && expertData.length > 0) {
        //   setExpert(expertData[0]);
        // }

      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setError("Failed to load user profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      // Reset form when opening modal
      setFormData({ message: "", preferred_contact_method: "" });
      setFormErrors({});
      setSubmitSuccess(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { message?: string } = {};

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // For now, just show success message without any API calls
    setSubmitSuccess(true);
  };

  if (isLoading) {
    return (
      <Container className="centered-container">
        <div className="text-center">
          <Spinner color="primary" />
          <p className="mt-2">Loading user profile...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="centered-container">
        <Alert color="danger">{error}</Alert>
        <div className="text-center mt-3">
          <Button color="primary" tag={Link} to="/experts">
            Back to Experts
          </Button>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="centered-container">
        <Alert color="warning">User not found.</Alert>
        <div className="text-center mt-3">
          <Button color="primary" tag={Link} to="/experts">
            Back to Experts
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="centered-container">
      <Row>
        <Col md="10" className="mx-auto">
          <Card className="text-dark bg-light m-3">
            <CardHeader>
              <Row className="align-items-center">
                <Col md="8">
                  {/* Name removed from header */}
                </Col>
                <Col md="4" className="text-end">
                  {/* Removed badges */}
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {/* Profile Photo and Basic Info */}
              <Row className="mb-4">
                <Col md="4" className="text-center">
                  <img
                    src={expert?.photo || "https://via.placeholder.com/150x150/6c757d/ffffff?text=?"}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="rounded-circle mb-3"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                  {expert && (
                    <Button
                      color="primary"
                      size="lg"
                      onClick={toggleModal}
                      className="w-100"
                    >
                      Request Connection
                    </Button>
                  )}
                </Col>
                <Col md="8">
                  <Row>
                    <Col md="6">
                      <h4 className="mb-3"><strong>{user.first_name} {user.last_name}</strong></h4>
                      <p><strong>Location:</strong> {user.city}, {user.state}</p>
                      {user.local_group && (
                        <p><strong>Local Group:</strong> {user.local_group.group_name}</p>
                      )}
                      {expert && (
                        <>
                          <p><strong>Occupation:</strong> {expert.occupation}</p>
                          {expert.industry && (
                            <p><strong>Industry:</strong> {expert.industry.industry_name}</p>
                          )}
                        </>
                      )}
                    </Col>
                    <Col md="6">
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* Expert Information */}
              {expert && (
                <div className="mt-4">
                  <hr />
                  
                  {/* Background */}
                  {expert.background && (
                    <div className="mb-4">
                      <p>{expert.background}</p>
                    </div>
                  )}

                  {/* Expertise Records */}
                  {expert.expertise && expert.expertise.length > 0 && (
                    <div className="mt-4">
                      <h6><strong>Expertise & Services</strong></h6>
                      {expert.expertise.map((exp, index) => (
                        <Card key={index} className="mb-3">
                          <CardBody>
                            <h6 className="text-primary">Expertise #{index + 1}</h6>
                            <p><strong>What they're offering:</strong> {exp.what_offering}</p>
                            {exp.who_would_benefit && (
                              <p><strong>Who would benefit:</strong> {exp.who_would_benefit}</p>
                            )}
                            {exp.why_choose_you && (
                              <p><strong>Why choose them:</strong> {exp.why_choose_you}</p>
                            )}
                            {exp.skills_not_offered && (
                              <p><strong>What's not offered:</strong> {exp.skills_not_offered}</p>
                            )}
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="text-center mt-4">
                <Button
                  color="secondary"
                  tag={Link}
                  to="/experts"
                  className="me-2"
                >
                  Back to Experts
                </Button>
                {expert && (
                  <Button
                    color="primary"
                    onClick={toggleModal}
                  >
                    Request Connection
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Connection Request Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          Request Connection with {user.first_name} {user.last_name}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            {submitSuccess ? (
              <Alert color="success" className="text-center">
                <h5>Connection Request Sent!</h5>
                <p>Your message has been sent to {user.first_name}. They will receive your email address and can reply directly to you.</p>
              </Alert>
            ) : (
              <>
                <Alert color="info">
                  <strong>Note:</strong> Your email address will be shared with {user.first_name} so they can reply to your message directly.
                </Alert>

                <FormGroup>
                  <Label htmlFor="message">
                    Message / Context <span className="text-danger">*</span>
                  </Label>
                  <Input
                    id="message"
                    name="message"
                    type="textarea"
                    rows="6"
                    value={formData.message}
                    onChange={handleInputChange}
                    invalid={!!formErrors.message}
                    placeholder="Please describe what you're looking for help with, your background, and any specific questions you have..."
                  />
                  <FormFeedback>{formErrors.message}</FormFeedback>
                  <small className="form-text text-muted">
                    Minimum 10 characters. Be specific about what you need help with.
                  </small>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="preferred_contact_method">Preferred Contact Method (Optional)</Label>
                  <Input
                    id="preferred_contact_method"
                    name="preferred_contact_method"
                    type="select"
                    value={formData.preferred_contact_method}
                    onChange={handleInputChange}
                  >
                    <option value="">No preference</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone call</option>
                    <option value="video_call">Video call (Zoom, etc.)</option>
                    <option value="in_person">In-person meeting</option>
                    <option value="other">Other (specify in message)</option>
                  </Input>
                  <small className="form-text text-muted">
                    Let them know your preferred way to communicate.
                  </small>
                </FormGroup>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {!submitSuccess && (
              <>
                <Button color="secondary" onClick={toggleModal}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                >
                  Send Connection Request
                </Button>
              </>
            )}
          </ModalFooter>
        </Form>
      </Modal>
    </Container>
  );
};

export default UserDetail;
