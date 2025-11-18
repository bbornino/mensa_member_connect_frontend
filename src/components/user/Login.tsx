import React, { useState, useEffect} from "react";
import type { FormEvent } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { Container, Form, Card, CardTitle, CardBody, CardFooter, FormGroup, Label, Input } from "reactstrap";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);

  const navigate = useNavigate();
  const { login, user } = useAuth();


  const handlePasswordToggle = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    document.title = "Login | Network of American Mensa Member Experts";
  }, []);

  // Redirect to /experts when user is set after a successful login
  useEffect(() => {
    if (user && shouldRedirect) {
      navigate("/experts");
      setShouldRedirect(false);
    }
  }, [user, shouldRedirect, navigate]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isSignedIn = await login(username, password);
    if (!isSignedIn) {
      setError("Failed to sign in. Please try again.");
      return;
    }

    // Set flag to trigger redirect when user state updates
    // This ensures ProtectedRoute sees the user and doesn't redirect back
    setShouldRedirect(true);
  };

  return (
    <Container className="centered-container">
      <Form onSubmit={handleLogin}>
        <Card className="text-dark bg-light m-3 card-narrow">
          <CardTitle tag="h5" className="p-3 mb-0"><strong>Login</strong></CardTitle>
          <CardBody>
            <FormGroup>
              <Label htmlFor="username">User Name</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
