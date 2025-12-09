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
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch industries when component becomes active
  useEffect(() => {
    if (!isActive) return;

    const fetchIndustries = async () => {
      setIsLoading(true);
      try {
        const data = await apiRequest("industries/", { method: "GET" });
        if (data && Array.isArray(data)) {
          // Transform data to ensure all required fields are present
          const transformedData = data.map(item => ({
            id: item.id,
            industry_name: item.industry_name || '',
            industry_description: item.industry_description || ''
          }));
          // Sort alphabetically by industry_name
          transformedData.sort((a, b) => 
            a.industry_name.localeCompare(b.industry_name)
          );
          setIndustries(transformedData);
        }
      } catch (error) {
        console.error("Failed to fetch industries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndustries();
  }, [isActive, apiRequest]);

  // CREATE
  const handleAdd = async () => {
    if (!newName.trim()) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      console.log("Adding industry:", { industry_name: newName, industry_description: newDesc });
      const data = await apiRequest("industries/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry_name: newName, industry_description: newDesc }),
      });

      console.log("API response:", data);
      
      if (data && typeof data === 'object' && !Array.isArray(data) && 'id' in data) {
        // Transform the response to ensure all fields are present
        const newIndustry = {
          id: (data as any).id,
          industry_name: (data as any).industry_name || '',
          industry_description: (data as any).industry_description || ''
        };
        console.log("Adding to state:", newIndustry);
        setIndustries((prev) => {
          const updated = [...prev, newIndustry];
          // Sort alphabetically by industry_name
          updated.sort((a, b) => a.industry_name.localeCompare(b.industry_name));
          return updated;
        });
        setNewName("");
        setNewDesc("");
      } else {
        console.error("Invalid response format or error:", data);
        setErrorMessage("Failed to add industry. Please try again.");
        // If there was an error, try to refresh the list to see if it was actually added
        const refreshData = await apiRequest("industries/", { method: "GET" });
        if (refreshData && Array.isArray(refreshData)) {
          const transformedData = refreshData.map(item => ({
            id: item.id,
            industry_name: item.industry_name || '',
            industry_description: item.industry_description || ''
          }));
          // Sort alphabetically by industry_name
          transformedData.sort((a, b) => 
            a.industry_name.localeCompare(b.industry_name)
          );
          setIndustries(transformedData);
          // Clear error if the item was actually added
          if (transformedData.some(item => item.industry_name === newName)) {
            setErrorMessage("");
            setNewName("");
            setNewDesc("");
          }
        }
      }
    } catch (error) {
      console.error("Failed to add industry:", error);
      setErrorMessage("Failed to add industry. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // UPDATE
  const handleUpdate = async (id: number) => {
    const edit = editingIndustries[id];
    if (!edit) return;

    // Check if there are actual changes
    const original = industries.find(i => i.id === id);
    if (original && 
        original.industry_name === edit.industry_name && 
        original.industry_description === edit.industry_description) {
      // No changes, just remove from editing state
      setEditingIndustries((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      return;
    }

    // Validate that name is not empty
    if (!edit.industry_name.trim()) {
      setErrorMessage("Industry name cannot be empty.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await apiRequest(`industries/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edit),
      });

      if (data && !Array.isArray(data)) {
        const updatedIndustry = {
          id: (data as any).id,
          industry_name: (data as any).industry_name || '',
          industry_description: (data as any).industry_description || ''
        };
        setIndustries((prev) => {
          const updated = prev.map((i) =>
            i.id === id
              ? { ...i, industry_name: updatedIndustry.industry_name, industry_description: updatedIndustry.industry_description }
              : i
          );
          // Sort alphabetically by industry_name after update
          updated.sort((a, b) => a.industry_name.localeCompare(b.industry_name));
          return updated;
        });
        // Remove from editing state
        setEditingIndustries((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
        setErrorMessage(""); // Clear any previous errors
      } else {
        setErrorMessage("Failed to update industry. Invalid response from server.");
      }
    } catch (error) {
      console.error("Failed to update industry:", error);
      setErrorMessage("Failed to update industry. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    const industry = industries.find(i => i.id === id);
    const industryName = industry?.industry_name || "this industry";
    
    if (!window.confirm(`Are you sure you want to delete "${industryName}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      await apiRequest(`industries/${id}/`, { method: "DELETE" });
      setIndustries((prev) => prev.filter((i) => i.id !== id));
      // Remove from editing state
      setEditingIndustries((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      console.error("Failed to delete industry:", error);
      setErrorMessage(`Failed to delete industry. ${error instanceof Error ? error.message : "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
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
      {errorMessage && <Alert color="danger">{errorMessage}</Alert>}

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
            <Label for="newDesc">Description (optional):</Label>
            <Input id="newDesc" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Optional description" />
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

              // Check if there are changes
              const hasChanges = 
                edit.industry_name !== industry.industry_name ||
                edit.industry_description !== industry.industry_description;

              return (
                <tr key={industry.id}>
                  <td>
                    <Input
                      value={edit.industry_name}
                      onChange={(e) =>
                        setEditingIndustries((prev) => ({
                          ...prev,
                          [industry.id]: { ...edit, industry_name: e.target.value },
                        }))
                      }
                      disabled={isLoading}
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
                      placeholder="Optional description"
                      disabled={isLoading}
                    />
                  </td>
                  <td>
                    <Button
                      color="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleUpdate(industry.id)}
                      disabled={isLoading || !hasChanges}
                    >
                      Save
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(industry.id)}
                      disabled={isLoading}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
            {industries.length === 0 && !isLoading && (
              <tr>
                <td colSpan={3} className="text-center">No industry types found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminIndustryTypes;
