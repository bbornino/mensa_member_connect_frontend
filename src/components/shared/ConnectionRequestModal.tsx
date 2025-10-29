import React, { useState } from "react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // For now, just show success message without any API calls
    // TODO: Implement actual API call to submit connection request
    console.log("Connection request for expert ID:", expertId, "with data:", formData);
    setSubmitSuccess(true);
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
                  Message / Context <span className="text-danger">*</span>
                </Label>
                <Input
                  id="message"
                  name="message"
                  type="textarea"
                  rows="6"
                  value={formData.message}
                  onChange={handleInputChange}
                  invalid={!!formErrors.message}
                  placeholder="Please describe what you're looking for help with, your background, and any specific questions you have..."
                />
                <FormFeedback>{formErrors.message}</FormFeedback>
                <small className="form-text text-muted">
                  Minimum 10 characters. Be specific about what you need help
                  with.
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
                  Let them know your preferred way to communicate.
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

