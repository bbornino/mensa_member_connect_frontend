import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Card,
  CardTitle,
  CardBody,
  Alert,
  Button,
} from "reactstrap";
import { useAuth } from "../../context/AuthContext";

const RegistrationComplete: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Registration Complete | Network of American Mensa Member Experts";
    
    // Redirect if not logged in
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  return (
    <Container className="centered-container">
      <Card className="text-dark bg-light m-3 card-wide">
        <CardTitle tag="h5" className="p-3 mb-0">
          <strong>Registration Complete!</strong>
        </CardTitle>
        <CardBody>
          <Alert color="info" className="mb-4">
            <h5 className="alert-heading">Account Pending Approval</h5>
            <p className="mb-0">
              Thank you for registering with the Network of American Mensa Member Experts. 
              Your account is awaiting approval by our team. You will be notified once it is active.
            </p>
          </Alert>

          <div className="mb-4">
            <h6><strong>While You Wait:</strong></h6>
            <p>
              Please note that you won't have access to the Experts directory until your account is approved. 
              However, you can update your profile now if you wish to offer your expertise to other members 
              once you're approved.
            </p>
          </div>

          <div className="mb-4">
            <h6><strong>What Happens Next?</strong></h6>
            <ul>
              <li>Our team will review your registration and verify your Mensa membership</li>
              <li>This process typically takes 24-48 hours</li>
              <li>You'll receive an email notification once your account is approved</li>
              <li>Once approved, you'll have full access to browse experts and their profiles</li>
            </ul>
          </div>

          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Button 
              color="primary" 
              tag={Link} 
              to="/profile"
            >
              Update My Profile
            </Button>
            <Button 
              color="secondary" 
              tag={Link} 
              to="/"
            >
              Go to Home
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default RegistrationComplete;
