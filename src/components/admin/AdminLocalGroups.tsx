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

interface LocalGroup {
  id: number;
  group_name: string;
  group_number: string;
}

interface Props {
  isActive: boolean;
}

interface EditingGroups {
  [id: number]: { group_name: string; group_number: string };
}

const AdminLocalGroups: React.FC<Props> = ({ isActive }) => {
  const { apiRequest, error: apiError } = useApiRequest<LocalGroup[]>();
  const [localGroups, setLocalGroups] = useState<LocalGroup[]>([]);
  const [editingGroups, setEditingGroups] = useState<EditingGroups>({});
  const [isLoading, setIsLoading] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupNumber, setNewGroupNumber] = useState("");

  // Fetch local groups
  useEffect(() => {
    if (!isActive) return;

    const fetchGroups = async () => {
      setIsLoading(true);
      const data = await apiRequest("local_groups/", { method: "GET" });
      if (data && Array.isArray(data)) setLocalGroups(data);
      setIsLoading(false);
    };

    fetchGroups();
  }, [isActive, apiRequest]);

  // CREATE
  const handleAdd = async () => {
    if (!newGroupName.trim() || !newGroupNumber.trim()) return;
    setIsLoading(true);
    const data = await apiRequest("local_groups/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group_name: newGroupName, group_number: newGroupNumber }),
    });

    if (data && !Array.isArray(data)) {
      setLocalGroups((prev) => [...prev, data]);
      setNewGroupName("");
      setNewGroupNumber("");
    }

    setIsLoading(false);
  };

  // UPDATE
  const handleUpdate = async (id: number) => {
    const edit = editingGroups[id];
    if (!edit) return;

    setIsLoading(true);
    const data = await apiRequest(`local_groups/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edit),
    });

    if (data && !Array.isArray(data)) {
      const updatedGroup = data as LocalGroup;
      setLocalGroups((prev) =>
        prev.map((g) =>
          g.id === id
            ? { ...g, group_name: updatedGroup.group_name, group_number: updatedGroup.group_number }
            : g
        )
      );

      // Remove from editing state
      setEditingGroups((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }

    setIsLoading(false);
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    setIsLoading(true);
    await apiRequest(`local_groups/${id}/`, { method: "DELETE" });
    setLocalGroups((prev) => prev.filter((g) => g.id !== id));

    // Remove from editing state
    setEditingGroups((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    setIsLoading(false);
  };

  if (!isActive) return null;

  return (
    <div className="mt-3">
      <h6><strong>Local Groups</strong></h6>

      {isLoading && (
        <div className="text-center">
          <Spinner color="primary" />
          <p className="mt-2">Loading...</p>
        </div>
      )}
      {apiError && <Alert color="danger">{apiError}</Alert>}

      {/* Add new group */}
      <Row className="mb-3">
        <Col md="4">
          <FormGroup>
            <Label for="newGroupName">Group Name:</Label>
            <Input
              id="newGroupName"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md="2">
          <FormGroup>
            <Label for="newGroupNumber">Group Number:</Label>
            <Input
              id="newGroupNumber"
              value={newGroupNumber}
              onChange={(e) => setNewGroupNumber(e.target.value)}
            />
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
              <th>Group Name</th>
              <th>Group Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {localGroups.map((group) => {
              const edit = editingGroups[group.id] || {
                group_name: group.group_name,
                group_number: group.group_number,
              };

              return (
                <tr key={group.id}>
                  {/* <td>{group.id}</td> */}
                  <td>
                    <Input
                      value={edit.group_name}
                      onChange={(e) =>
                        setEditingGroups((prev) => ({
                          ...prev,
                          [group.id]: { ...edit, group_name: e.target.value },
                        }))
                      }
                    />
                  </td>
                  <td>
                    <Input
                      value={edit.group_number}
                      onChange={(e) =>
                        setEditingGroups((prev) => ({
                          ...prev,
                          [group.id]: { ...edit, group_number: e.target.value },
                        }))
                      }
                    />
                  </td>
                  <td>
                    <Button
                      color="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleUpdate(group.id)}
                    >
                      Save
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(group.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
            {localGroups.length === 0 && !isLoading && (
              <tr>
                <td colSpan={4} className="text-center">No local groups found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminLocalGroups;
