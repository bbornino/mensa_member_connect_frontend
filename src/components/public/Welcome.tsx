import { Link } from "react-router-dom";
import { Container, Card, CardBody, CardTitle, Alert, ListGroup, ListGroupItem } from "reactstrap";

export default function Welcome() {
  return (
    <Container className="centered-container">
      <Card className="text-dark bg-light m-3">
        <CardBody style={{ padding: "2rem" }}>
          <CardTitle tag="h1" className="text-center mb-4">
            <strong>Welcome to the <br/>Network of American Mensa Member Experts!</strong>
          </CardTitle>
          
          <p className="lead text-center mb-4">
            This interactive site is designed to bring together Mensa members who want to volunteer their
            expertise with those who may benefit from their guidance.
          </p>

          <div className="mb-4">
            <h3 className="mb-3">Are you looking to:</h3>
            <ListGroup flush>
              <ListGroupItem>
                <strong>Share your expertise?</strong> Do you have a unique skill or passion that you want to share with other Mensa members?
              </ListGroupItem>
              <ListGroupItem>
                <strong>Find mentorship?</strong> Are you looking for mentorship in your field, advice, or answers to specific questions outside your expertise?
              </ListGroupItem>
            </ListGroup>
          </div>

          <div className="text-center mb-4">
            <p className="h4 mb-3">Connect with a Mensa member!</p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/login" className="btn btn-primary btn-lg">
                Log In
              </Link>
              <Link to="/register" className="btn btn-outline-primary btn-lg">
                Register
              </Link>
            </div>
          </div>

          <Alert color="info" className="mt-4">
            <strong>Note:</strong> This platform is still in the beta-testing phase. Look for new features soon!
          </Alert>
        </CardBody>
      </Card>
    </Container>
  );
}
