import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Layout from "@/components/Layout";

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: "", username: "", password: "" });

  const fetchAdmins = async () => {
    try {
      const { data } = await axios.get("/api/admin");
      setAdmins(data);
    } catch (error) {
      console.error(`[Admin Management] Error fetching admins: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put("/api/admin", formData);
      } else {
        await axios.post("/api/admin", formData);
      }
      setModalOpen(false);
      fetchAdmins();
      setFormData({ id: "", username: "", password: "" });
    } catch (error) {
      console.error(`[Admin Management] Error saving admin: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("/api/admin", { data: { deleteId: id } });
      fetchAdmins();
    } catch (error) {
      console.error(`[Admin Management] Error deleting admin: ${error.message}`);
    }
  };

  return (
    <Layout>
      <Container>
        <Title>Admin Management</Title>
        <AdminList>
          {admins.map((admin) => (
            <AdminItem key={admin._id}>
              <AdminInfo>{admin.username}</AdminInfo>
              <ActionButtons>
                <Button
                  onClick={() => {
                    setFormData({ id: admin._id, username: admin.username, password: "" });
                    setModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <DeleteButton onClick={() => handleDelete(admin._id)}>Delete</DeleteButton>
              </ActionButtons>
            </AdminItem>
          ))}
        </AdminList>
        <CreateButton onClick={() => setModalOpen(true)}>Create Admin</CreateButton>

        {isModalOpen && (
          <Modal>
            <ModalContent>
              <ModalTitle>{formData.id ? "Edit Admin" : "Create Admin"}</ModalTitle>
              <Input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <SaveButton onClick={handleSave}>Save</SaveButton>
              <CloseButton onClick={() => setModalOpen(false)}>Close</CloseButton>
            </ModalContent>
          </Modal>
        )}
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3); /* Dim white border */
  border-radius: 10px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  color: #fff;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const AdminList = styled.div`
  margin-top: 20px;
`;

const AdminItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3); /* Dim white border */
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const AdminInfo = styled.span`
  font-size: 1rem;
  color: #fff;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #0056b3;
  }
`;

const DeleteButton = styled(Button)`
  background: #f44336;

  &:hover {
    background: #d32f2f;
  }
`;

const CreateButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #28a745;
  color: white;
  padding: 15px 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;

  &:hover {
    background: #218838;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const ModalTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-right: 10px;

  &:hover {
    background: #0056b3;
  }
`;

const CloseButton = styled.button`
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: #5a6268;
  }
`;
