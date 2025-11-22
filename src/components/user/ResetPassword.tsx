import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
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

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Reset Password | Network of American Mensa Member Experts";
    
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const handlePasswordToggle = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}users/password-reset-confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          new_password: password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || "Failed to reset password");
      }

      // Success
      setSuccess(data.message || "Password has been successfully reset. You can now log in with your new password.");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Container className="centered-container">
        <Card className="text-dark bg-light m-3 card-narrow">
          <CardBody>
            <p style={{ color: "red" }}>
              Invalid reset link. Please request a new password reset.
            </p>
            <div className="text-center mt-3">
              <Link to="/forgot-password">Request Password Reset</Link>
            </div>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="centered-container">
      <Form onSubmit={handleSubmit}>
        <Card className="text-dark bg-light m-3 card-narrow">
          <CardTitle tag="h5" className="p-3 mb-0">
            <strong>Reset Password</strong>
          </CardTitle>
          <CardBody>
            <p className="mb-3">Enter your new password below.</p>
            <FormGroup>
              <Label htmlFor="password">New Password</Label>
              <div className="input-group">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Enter new password (min 8 characters)"
                  minLength={8}
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
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="input-group">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Confirm new password"
                  minLength={8}
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
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && (
              <>
                <p style={{ color: "green" }}>{success}</p>
                <p style={{ color: "green" }}>Redirecting to login...</p>
              </>
            )}
          </CardBody>
          <CardFooter>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading || !!success}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;

