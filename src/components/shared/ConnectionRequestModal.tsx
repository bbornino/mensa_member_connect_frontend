import React, { useState } from "react";
import { useApiRequest } from "../../utils/useApiRequest";
import { analytics } from "../../utils/analytics";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  FormFeedback,
} from "reactstrap";

interface ConnectionRequestModalProps {
  isOpen: boolean;
  toggle: () => void;
  expertName: string;
  expertId: number;
}

interface ConnectionRequestForm {
  message: string;
  preferred_contact_method: string;
}

const ConnectionRequestModal: React.FC<ConnectionRequestModalProps> = ({
  isOpen,
  toggle,
  expertName,
  expertId,
}) => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<ConnectionRequestForm>({
    message: "",
    preferred_contact_method: "",
  });
  const [formErrors, setFormErrors] = useState<{ message?: string }>({});
  const { apiRequest } = useApiRequest();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { message?: string } = {};

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log("Connection request for expert ID:", expertId, "with data:", formData);

    try {
      const body = {
        expert_id: expertId,
        message: formData.message,
        preferred_contact_method: formData.preferred_contact_method || null,
      };

      await apiRequest("connection_requests/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      analytics.trackConnectionRequest(expertId, formData.preferred_contact_method || undefined);
      setSubmitSuccess(true);
    } catch (error: any) {
      console.error("Error sending connection request:", error);
      setFormErrors({ message: "Failed to send request. Please try again." });
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({ message: "", preferred_contact_method: "" });
    setFormErrors({});
    setSubmitSuccess(false);
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg">
      <ModalHeader toggle={handleClose}>
        Request Connection with {expertName}
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {submitSuccess ? (
            <Alert color="success" className="text-center">
              <h5>Connection Request Sent!</h5>
              <p>
                Your message has been sent to {expertName}. They will receive
                your email address and can reply directly to you.
              </p>
            </Alert>
          ) : (
            <>
              <Alert color="info">
                <strong>Note:</strong> Your email address will be shared with{" "}
                {expertName} so they can reply to your message directly.
              </Alert>

              <FormGroup>
                <Label htmlFor="message">
                Message<span className="text-danger">*</span>
                </Label>
                <Input
                  id="message"
                  name="message"
                  type="textarea"
                  rows="6"
                  value={formData.message}
                  onChange={handleInputChange}
                  invalid={!!formErrors.message}
                  placeholder="Please describe what expertise or advice you are seeking, and your pertinent information related to the request. Please be specific."
                />
                <FormFeedback>{formErrors.message}</FormFeedback>
                <small className="form-text text-muted">
                  
                </small>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="preferred_contact_method">
                  Preferred Contact Method (Optional)
                </Label>
                <Input
                  id="preferred_contact_method"
                  name="preferred_contact_method"
                  type="select"
                  value={formData.preferred_contact_method}
                  onChange={handleInputChange}
                >
                  <option value="">No preference</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone call</option>
                  <option value="video_call">Video call (Zoom, etc.)</option>
                  <option value="in_person">In-person meeting</option>
                  <option value="other">Other (specify in message)</option>
                </Input>
                <small className="form-text text-muted">
                  Let them know your preferred way to communicate. Some experts may have a chosen method of communication, and may not be able to respond to requests through other means.
                </small>
              </FormGroup>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {!submitSuccess && (
            <>
              <Button color="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Send Message
              </Button>
            </>
          )}
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ConnectionRequestModal;

