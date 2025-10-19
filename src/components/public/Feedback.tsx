import React, { useEffect } from "react";
import { Container, Card, CardTitle, CardBody, Alert, Spinner } from "reactstrap";

const Feedback: React.FC = () => {
  const FEEDBACK_URL = "https://www.google.com";

  useEffect(() => {
    // Redirect to external feedback URL after a short delay
    const timer = setTimeout(() => {
      window.open(FEEDBACK_URL, "_blank");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container className="centered-container">
      <Card className="text-dark bg-light m-3">
        <CardTitle tag="h4" className="text-center mb-4">
          <strong>Feedback</strong>
        </CardTitle>
        <CardBody className="text-center">
          <Spinner color="primary" className="mb-3" />
          <Alert color="info">
            <strong>Redirecting to feedback form...</strong>
            <br />
            You will be redirected to our external feedback system in a moment.
          </Alert>
          <p className="mt-3">
            If you are not redirected automatically,{" "}
            <a 
              href={FEEDBACK_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              click here to access the feedback form
            </a>
          </p>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Feedback;
