import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
} from "reactstrap";
import ConnectionRequestModal from "../shared/ConnectionRequestModal";
import { useApiRequest } from "../../utils/useApiRequest";
import { getRandomPlaceholderImage } from "../../utils/constants";

interface UserDetail {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  member_id: number | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  role: string;
  status: string;
  date_joined: string;
  local_group: {
    group_name: string;
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
    area_of_expertise_name?: string;
    what_offering: string;
    who_would_benefit: string;
    why_choose_you: string;
    skills_not_offered: string;
  }[];
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { apiRequest } = useApiRequest();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [expert, setExpert] = useState<Expert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Expert Details | Network of American Mensa Member Experts";
  }, []);

  useEffect(() => {
    if (user) {
      document.title = `${user.first_name} ${user.last_name} | Network of American Mensa Member Experts`;
    }
  }, [user]);

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!id) {
        setError("Invalid user ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        
        // Fetch user data
        const userData: any = await apiRequest(`users/${id}/`);
        if (!userData) {
          throw new Error("User not found");
        }

        // Transform user data to match expected format
        const transformedUser: UserDetail = {
          id: userData.id,
          username: userData.username || "",
          email: userData.email || "",
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          member_id: userData.member_id || null,
          city: userData.city || null,
          state: userData.state || null,
          phone: userData.phone || null,
          role: userData.role || "member",
          status: userData.status || "active",
          date_joined: userData.date_joined || "",
          local_group: userData.local_group || null,
        };

        setUser(transformedUser);

        // Check if user is an expert (has occupation and background)
        const isExpert = userData.occupation && userData.background;
        
        if (isExpert) {
          // Transform expert data
          const transformedExpert: Expert = {
            id: userData.id,
            occupation: userData.occupation || "",
            industry: userData.industry ? {
              id: userData.industry.id,
              industry_name: userData.industry.industry_name,
            } : null,
            background: userData.background || "",
            availability_status: userData.availability_status || "",
            show_contact_info: userData.show_contact_info || false,
            photo: userData.photo, // Optional, may not be present
          };

          // Fetch expertise records for this expert
          const expertises: any[] = await apiRequest(`expertises/by_user/${id}/`) || [];
          
          // Check if user has any expertise records
          if (!expertises || expertises.length === 0) {
            throw new Error("This user is not an expert and does not have any expertise listed.");
          }
          
          transformedExpert.expertise = expertises.map((exp: any) => ({
            area_of_expertise_name: exp.area_of_expertise_name,
            what_offering: exp.what_offering || "",
            who_would_benefit: exp.who_would_benefit || "",
            why_choose_you: exp.why_choose_you || "",
            skills_not_offered: exp.skills_not_offered || "",
          }));

          setExpert(transformedExpert);
        } else {
          throw new Error("This user is not an expert and does not have any expertise listed.");
        }

      } catch (error: any) {
        console.error("Failed to fetch user details:", error);
        setError(error.message || "Failed to load user profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetail();
  }, [id, apiRequest]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
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
          <div className="mb-3">
            <Link to="/experts" style={{ textDecoration: 'none', color: '#007bff' }}>
              ← Back to Experts
            </Link>
          </div>
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
                    src={expert?.photo || getRandomPlaceholderImage()}
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
                      Send Message
                    </Button>
                  )}
                </Col>
                <Col md="8" className="mt-3 mt-md-0">
                  <Row>
                    <Col md="12">
                      <h4 className="mb-3"><strong>{user.first_name} {user.last_name}</strong></h4>
                      {user.city && user.state && (
                        <p><strong>Location:</strong> {user.city}, {user.state}</p>
                      )}
                      {user.local_group && (
                        <p><strong>Local Group:</strong> {user.local_group.group_name}</p>
                      )}
                      {expert && (
                        <>
                          <p><strong>Occupation:</strong> {expert.occupation}</p>
                          {expert.show_contact_info && (
                            <>
                              {user.phone && (
                                <p><strong>Phone:</strong> {user.phone}</p>
                              )}
                              {user.email && (
                                <p><strong>Email:</strong> {user.email}</p>
                              )}
                            </>
                          )}
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
                            {exp.area_of_expertise_name && (
                              <p><strong>Area of Expertise:</strong> {exp.area_of_expertise_name}</p>
                            )}
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
                    Send Message
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Connection Request Modal */}
      <ConnectionRequestModal
        isOpen={modalOpen}
        toggle={toggleModal}
        expertName={`${user.first_name} ${user.last_name}`}
        expertId={user.id}
      />
    </Container>
  );
};

export default UserDetail;
