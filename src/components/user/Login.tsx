import React, { useState, useEffect, useRef} from "react";
import type { FormEvent } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../../utils/constants";
import { Container, Form, Card, CardTitle, CardBody, CardFooter, FormGroup, Label, Input } from "reactstrap";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const loginSuccessRef = useRef<boolean>(false);

  const navigate = useNavigate();
  const { login, googleLogin, user } = useAuth();

  const handlePasswordToggle = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    document.title = "Login | Network of American M-Member Experts";
  }, []);

  // Redirect when user becomes available after successful login
  useEffect(() => {
    if (user && loginSuccessRef.current) {
      loginSuccessRef.current = false;
      navigate("/experts", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    loginSuccessRef.current = false;

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || "Failed to sign in. Please try again.");
      return;
    }

    // Mark that login was successful - useEffect will handle redirect when user state updates
    loginSuccessRef.current = true;
    
    // If user is already available (from localStorage), navigate immediately
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      navigate("/experts", { replace: true });
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError("");
    loginSuccessRef.current = false;

    const credential = credentialResponse.credential;
    if (!credential) {
      setError("Google sign-in did not return a credential.");
      return;
    }

    const result = await googleLogin(credential);
    if (!result.success) {
      setError(result.error || "Google sign-in failed. Please try again.");
      return;
    }

    loginSuccessRef.current = true;
    if (result.needsRegistrationCompletion) {
      navigate("/register/complete-registration", { replace: true });
      return;
    }

    navigate("/experts", { replace: true });
  };

  return (
    <Container className="centered-container">
      <Card className="text-dark bg-light m-3 card-wide">
        <CardTitle tag="h5" className="p-3 mb-0"><strong>Login</strong></CardTitle>
        <CardBody>
          <div className="row g-3 align-items-stretch">
            <div className="col-md-5 d-flex flex-column justify-content-center align-items-center text-center">
              <p className="text-muted mb-3">Sign in quickly with your Google account.</p>
              {GOOGLE_CLIENT_ID ? (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google sign-in failed. Please try again.")}
                  text="continue_with"
                />
              ) : (
                <p className="text-muted mb-0">Google login is not configured.</p>
              )}
            </div>
            <div className="col-md-2 d-none d-md-flex align-items-center justify-content-center">
              <div className="d-flex flex-column align-items-center h-100 justify-content-center">
                <div style={{ width: "1px", height: "40px", backgroundColor: "#ced4da" }} />
                <span className="text-muted my-2" style={{ fontSize: "0.9rem" }}>or</span>
                <div style={{ width: "1px", height: "40px", backgroundColor: "#ced4da" }} />
              </div>
            </div>
            <div className="col-md-5">
              <Form onSubmit={handleLogin}>
                <FormGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <div className="input-group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                <div className="text-center mt-3">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
              </Form>
            </div>
          </div>
          {error && <p style={{ color: "red" }} className="mt-3 mb-0">{error}</p>}
        </CardBody>
        <CardFooter />
      </Card>
    </Container>
  );
};

export default Login;
