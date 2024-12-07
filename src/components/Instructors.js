import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Modal,
  TextField,
  Grid,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingInstructorId, setEditingInstructorId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    department: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/instructors/all")
      .then((response) => {
        setInstructors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching instructors:", error);
      });
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      department: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      (!isEditing && !formData.password) ||
      !formData.department
    ) {
      toast.error("All fields are required");
      return;
    }

    if (isEditing) {
      axios
        .put(`http://localhost:3001/api/instructors/${editingInstructorId}`, formData)
        .then((response) => {
          toast.success("Instructor updated successfully");
          setInstructors(
            instructors.map((instructor) =>
              instructor._id === editingInstructorId ? response.data.instructor : instructor
            )
          );
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Error updating instructor:", error);
        });
    } else {
      axios
        .post("http://localhost:3001/api/instructors/add", formData)
        .then((response) => {
          toast.success(response.data.message);
          setInstructors([...instructors, response.data.instructor]);
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Error adding instructor:", error);
        });
    }
  };

  const handleEdit = (instructor) => {
    setIsEditing(true);
    setEditingInstructorId(instructor._id);
    setFormData({
      firstName: instructor.firstName,
      lastName: instructor.lastName,
      email: instructor.email,
      phone: instructor.phone,
      password: "",
      department: instructor.department,
    });
    handleOpenModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this instructor?")) {
      axios
        .delete(`http://localhost:3001/api/instructors/${id}`)
        .then((response) => {
          toast.success("Instructor deleted successfully");
          setInstructors(instructors.filter((instructor) => instructor._id !== id));
        })
        .catch((error) => {
          console.error("Error deleting instructor:", error);
        });
    }
  };

  return (
    <div style={{ fontSize: "12px" }}>
      <Card style={{ marginBottom: "20px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
        <CardHeader
          title={
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography style={{ fontSize: "14px", fontWeight: "bold", color: "#0D3B66" }}>
                Instructors List
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleOpenModal}
                style={{ fontSize: "12px" }}
              >
                Add Instructor
              </Button>
            </Box>
          }
          style={{ paddingBottom: 0 }}
        />
        <CardContent style={{ paddingTop: 0 }}>
          {instructors.length === 0 ? (
            <Typography style={{ fontSize: "12px", color: "#888", textAlign: "center" }}>
              No instructors found.
            </Typography>
          ) : (
            <table
              className="table table-bordered mt-4"
              style={{
                fontSize: "12px",
                textAlign: "center",
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f1f1f1", color: "#333" }}>
                  <th style={{ padding: "8px" }}>First Name</th>
                  <th style={{ padding: "8px" }}>Last Name</th>
                  <th style={{ padding: "8px" }}>Email</th>
                  <th style={{ padding: "8px" }}>Phone</th>
                  <th style={{ padding: "8px" }}>Department</th>
                  <th style={{ padding: "8px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((instructor) => (
                  <tr key={instructor._id}>
                    <td style={{ padding: "8px" }}>{instructor.firstName}</td>
                    <td style={{ padding: "8px" }}>{instructor.lastName}</td>
                    <td style={{ padding: "8px" }}>{instructor.email}</td>
                    <td style={{ padding: "8px" }}>{instructor.phone}</td>
                    <td style={{ padding: "8px" }}>{instructor.department}</td>
                    <td style={{ padding: "8px" }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(instructor)}
                        style={{ fontSize: "12px", padding: "4px" }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDelete(instructor._id)}
                        style={{ fontSize: "12px", padding: "4px" }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Modal open={showModal} onClose={handleCloseModal}>
        <Box
          style={{
            width: "500px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            margin: "100px auto",
            padding: "20px",
            fontSize: "12px",
          }}
        >
          <Typography
            style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "20px" }}
          >
            {isEditing ? "Edit Instructor" : "Add Instructor"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  size="small"
                  style={{ fontSize: "12px" }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  size="small"
                  style={{ fontSize: "12px" }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  size="small"
                  style={{ fontSize: "12px" }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  size="small"
                  style={{ fontSize: "12px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  fullWidth
                  margin="dense"
                  size="small"
                  style={{ fontSize: "12px" }}
                />
              </Grid>
              {!isEditing && (
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    size="small"
                    style={{ fontSize: "12px" }}
                  />
                </Grid>
              )}
            </Grid>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ fontSize: "12px", marginRight: "8px" }}
              >
                {isEditing ? "Update Instructor" : "Add Instructor"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                style={{ fontSize: "12px" }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      
    </div>
  );
}

export default Instructors;
