import React, { useState, useEffect } from "react";
import { useApiRequest } from "../../utils/useApiRequest";
import {
  Spinner,
  Alert,
  Table,
  Button,
  Input,
  FormGroup,
  Label,
  Row,
  Col,
} from "reactstrap";

interface IndustryType {
  id: number;
  industry_name: string;
  industry_description: string;
}

interface Props {
  isActive: boolean;
}

interface EditingIndustries {
  [id: number]: { industry_name: string; industry_description: string };
}

const AdminIndustryTypes: React.FC<Props> = ({ isActive }) => {
  const { apiRequest, error: apiError } = useApiRequest<IndustryType[]>();
  const [industries, setIndustries] = useState<IndustryType[]>([]);
  const [editingIndustries, setEditingIndustries] = useState<EditingIndustries>({});
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Fetch industries when component becomes active
  useEffect(() => {
    if (!isActive) return;

    const fetchIndustries = async () => {
      setIsLoading(true);
      const data = await apiRequest("industries/", { method: "GET" });
      if (data && Array.isArray(data)) setIndustries(data);
      setIsLoading(false);
    };

    fetchIndustries();
  }, [isActive, apiRequest]);

  // CREATE
  const handleAdd = async () => {
    if (!newName.trim()) return;
    setIsLoading(true);
    const data = await apiRequest("industries/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ industry_name: newName, industry_description: newDesc }),
    });

    if (data && !Array.isArray(data)) {
      setIndustries((prev) => [...prev, data]);
      setNewName("");
      setNewDesc("");
    }
    setIsLoading(false);
  };

  // UPDATE
  const handleUpdate = async (id: number) => {
    const edit = editingIndustries[id];
    if (!edit) return;

    setIsLoading(true);
    const data = await apiRequest(`industries/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edit),
    });

    if (data && !Array.isArray(data)) {
      const updatedIndustry = data as IndustryType;
      setIndustries((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, industry_name: updatedIndustry.industry_name, industry_description: updatedIndustry.industry_description }
            : i
        )
      );
      // Remove from editing state
      setEditingIndustries((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }

    setIsLoading(false);
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this industry?")) return;
    setIsLoading(true);
    await apiRequest(`industries/${id}/`, { method: "DELETE" });
    setIndustries((prev) => prev.filter((i) => i.id !== id));
    // Remove from editing state
    setEditingIndustries((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setIsLoading(false);
  };

  if (!isActive) return null;

  return (
    <div className="mt-3">
      <h6><strong>Industry Types</strong></h6>

      {isLoading && (
        <div className="text-center">
          <Spinner color="primary" />
          <p className="mt-2">Loading...</p>
        </div>
      )}
      {apiError && <Alert color="danger">{apiError}</Alert>}

      {/* Add new industry */}
      <Row className="mb-3">
        <Col md="4">
          <FormGroup>
            <Label for="newName">Industry Name:</Label>
            <Input id="newName" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </FormGroup>
        </Col>
        <Col md="6">
          <FormGroup>
            <Label for="newDesc">Description:</Label>
            <Input id="newDesc" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          </FormGroup>
        </Col>
        <Col md="2" className="d-flex align-items-end">
          <Button color="success" onClick={handleAdd}>Add</Button>
        </Col>
      </Row>

      {/* Table */}
      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {industries.map((industry) => {
              const edit = editingIndustries[industry.id] || {
                industry_name: industry.industry_name,
                industry_description: industry.industry_description,
              };

              return (
                <tr key={industry.id}>
                  <td>{industry.id}</td>
                  <td>
                    <Input
                      value={edit.industry_name}
                      onChange={(e) =>
                        setEditingIndustries((prev) => ({
                          ...prev,
                          [industry.id]: { ...edit, industry_name: e.target.value },
                        }))
                      }
                    />
                  </td>
                  <td>
                    <Input
                      value={edit.industry_description}
                      onChange={(e) =>
                        setEditingIndustries((prev) => ({
                          ...prev,
                          [industry.id]: { ...edit, industry_description: e.target.value },
                        }))
                      }
                    />
                  </td>
                  <td>
                    <Button
                      color="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleUpdate(industry.id)}
                    >
                      Save
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(industry.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
            {industries.length === 0 && !isLoading && (
              <tr>
                <td colSpan={4} className="text-center">No industry types found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminIndustryTypes;
