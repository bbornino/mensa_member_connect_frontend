import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import { useApiRequest } from "../../utils/useApiRequest";
import { useAuth } from "../../context/AuthContext";

const CompleteRegistration: React.FC = () => {
  const { apiRequest } = useApiRequest();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [memberId, setMemberId] = useState("");
  const [localGroup, setLocalGroup] = useState("");
  const [localGroups, setLocalGroups] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    document.title = "Complete Registration | Network of American M-Member Experts";

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.member_id && user.local_group) {
      navigate("/register/expert-profile", { replace: true });
      return;
    }

    const fetchLocalGroups = async () => {
      try {
        const response = await apiRequest("local_groups/");
        const groups = (response?.results || response || []).map((group: any) => ({
          id: group.id,
          group_name: group.group_name,
        }));
        groups.sort((a: any, b: any) => a.group_name.localeCompare(b.group_name));
        setLocalGroups(groups);
      } catch (err) {
        console.error("Failed to fetch local groups:", err);
        setError("Could not load local groups. Please refresh and try again.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchLocalGroups();
  }, [apiRequest, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("You must be logged in to continue.");
      return;
    }

    if (!/^\d+$/.test(memberId.trim())) {
      setError("Mensa Membership Number must be numeric.");
      return;
    }

    if (!localGroup) {
      setError("Please select your local group.");
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest(`users/${user.id}/`, {
        method: "PATCH",
        body: JSON.stringify({
          member_id: Number(memberId.trim()),
          local_group_id: Number(localGroup),
        }),
      });

      const updatedUser = await apiRequest("users/me/");
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      window.location.href = "/register/expert-profile";
    } catch (err: any) {
      console.error("Failed to complete registration:", err);
      setError(err.message || "Unable to complete registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <Container className="centered-container">
        <div className="text-center p-5">
          <p>Loading...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="centered-container">
      <Card className="text-dark bg-light m-3 card-wide">
        <CardTitle tag="h5" className="p-3 mb-0">
          <strong>Complete Your Registration</strong>
        </CardTitle>
        <CardBody>
          <p className="text-muted">
            Please provide your Mensa membership number and local group before setting up your expert profile.
          </p>

          {error && <Alert color="danger">{error}</Alert>}

          <Form id="complete-registration-form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="member_id">
                Mensa Membership Number <span className="text-danger">*</span>
              </Label>
              <Input
                id="member_id"
                type="text"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="local_group">
                Local Group <span className="text-danger">*</span>
              </Label>
              <Input
                id="local_group"
                type="select"
                value={localGroup}
                onChange={(e) => setLocalGroup(e.target.value)}
                required
              >
                <option value="">Please select</option>
                {localGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.group_name}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Form>
        </CardBody>
        <CardFooter>
          <Button
            color="primary"
            type="submit"
            form="complete-registration-form"
            className="w-100"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Continue to Expert Profile"}
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default CompleteRegistration;
