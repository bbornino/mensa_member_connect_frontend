import React, { useState, useEffect, useRef} from "react";
import type { FormEvent } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { Container, Form, Card, CardTitle, CardBody, CardFooter, FormGroup, Label, Input } from "reactstrap";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const loginSuccessRef = useRef<boolean>(false);

  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handlePasswordToggle = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    document.title = "Login | Network of American Mensa Member Experts";
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

  return (
    <Container className="centered-container">
      <Form onSubmit={handleLogin}>
        <Card className="text-dark bg-light m-3 card-narrow">
          <CardTitle tag="h5" className="p-3 mb-0"><strong>Login</strong></CardTitle>
          <CardBody>
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
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="text-center mt-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </CardBody>
          <CardFooter>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </CardFooter>
        </Card>
      </Form>
    </Container>
  );
};

export default Login;
