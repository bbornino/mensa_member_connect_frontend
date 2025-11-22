import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../utils/constants";
import {
  Container,
  Form,
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Forgot Password | Network of American Mensa Member Experts";
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}users/password-reset-request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // If not JSON, try to get text
        const text = await response.text();
        throw new Error(text || `Server error: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.error || data.detail || "Failed to send reset email");
      }

      // Success - show message (we don't reveal if email exists)
      setSuccess(data.message || "If that email exists, a reset message will be sent.");
    } catch (err: any) {
      // Handle network errors (connection refused, etc.)
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Unable to connect to the server. Please check that the backend is running and try again.");
      } else {
        setError(err?.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="centered-container">
      <Form onSubmit={handleSubmit}>
        <Card className="text-dark bg-light m-3 card-narrow">
          <CardTitle tag="h5" className="p-3 mb-0">
            <strong>Forgot Password</strong>
          </CardTitle>
          <CardBody>
            <p className="mb-3">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter your email"
              />
            </FormGroup>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
          </CardBody>
          <CardFooter>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="text-center mt-3">
              <Link to="/login">Back to Login</Link>
            </div>
          </CardFooter>
        </Card>
      </Form>
    </Container>
  );
};

export default ForgotPassword;

