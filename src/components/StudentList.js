import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    password: "",
  });
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/student/students"
        );
        setStudents(response.data);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to fetch student data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleOpenDialog = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        department: student.department,
        password: "",
      });
    } else {
      setEditingStudent(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        password: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStudent(null);
  };

  const handleSave = async () => {
    try {
      console.log(editingStudent);
      if (editingStudent) {
        const response = await axios.put(
          `http://localhost:3001/api/student/${editingStudent._id}`,
          formData
        );
        setStudents((prev) =>
          prev.map((student) =>
            student._id === editingStudent._id ? response.data.student : student
          )
        );
      } else {
        const response = await axios.post(
          "http://localhost:3001/api/student/register",
          formData
        );
        setStudents((prev) => [...prev, response.data.student]);
      }
      handleCloseDialog();
    } catch (err) {
      console.error("Error saving student:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/student/${id}`);
      setStudents((prev) => prev.filter((student) => student._id !== id));
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Typography style={{ fontSize: "12px", color: "#888" }}>
          Loading...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Typography style={{ fontSize: "12px", color: "red" }}>
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h6"
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "#0D3B66",
          }}
        >
          Student List
        </Typography>
        <Button
          onClick={() => handleOpenDialog()}
          style={{
            fontSize: "12px",
            padding: "4px 8px",
            backgroundColor: "#007EA7",
            color: "#fff",
            borderRadius: "4px",
          }}
        >
          Add Student
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table
          style={{
            minWidth: 650,
            borderCollapse: "collapse",
          }}
          aria-label="student table"
        >
          <TableHead style={{ backgroundColor: "#f1f1f1" }}>
            <TableRow>
              {[
                "First Name",
                "Last Name",
                "Email",
                "Phone",
                "Department",
                "Actions",
              ].map((header) => (
                <TableCell
                  key={header}
                  align="left"
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    padding: "8px",
                    border: "1px solid #ccc",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student._id}>
                  {[
                    "firstName",
                    "lastName",
                    "email",
                    "phone",
                    "department",
                  ].map((field) => (
                    <TableCell
                      key={field}
                      align="left"
                      style={{
                        fontSize: "12px",
                        padding: "8px",
                        border: "1px solid #ccc",
                      }}
                    >
                      {student[field] || "Not provided"}
                    </TableCell>
                  ))}
                  <TableCell
                    align="left"
                    style={{
                      fontSize: "12px",
                      padding: "8px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <IconButton
                      onClick={() => handleOpenDialog(student)}
                      size="small"
                      style={{ fontSize: "12px" }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(student._id)}
                      size="small"
                      style={{ fontSize: "12px" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  style={{
                    fontSize: "12px",
                    padding: "8px",
                    border: "1px solid #ccc",
                    color: "#888",
                  }}
                >
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Student Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm" // Controls the dialog width
        PaperProps={{
          style: { padding: "16px", borderRadius: "8px" }, // Adds padding inside the dialog
        }}
      >
        <DialogTitle
          style={{
            fontSize: "14px", // Slightly larger font for the title
            marginBottom: "8px",
          }}
        >
          {editingStudent ? "Edit Student" : "Add Student"}
        </DialogTitle>
        <DialogContent>
          {["firstName", "lastName", "email", "phone", "department"].map(
            (field) => (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                type="text"
                value={formData[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
                fullWidth
                margin="dense"
                inputProps={{
                  style: { fontSize: "15px", padding: "15px" }, // Larger input size
                }}
                style={{ marginBottom: "12px" }} // Increased margin between fields
              />
            )
          )}
          {!editingStudent && (
            <TextField
              key="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              fullWidth
              margin="dense"
              inputProps={{
                style: { fontSize: "15px", padding: "15px" }, // Larger input size
              }}
              style={{ marginBottom: "12px" }} // Increased margin between fields
            />
          )}
        </DialogContent>

        <DialogActions style={{ padding: "8px 16px" }}>
          {" "}
          {/* Increased button area padding */}
          <Button
            onClick={handleCloseDialog}
            style={{
              fontSize: "12px",
              padding: "6px 12px",
              color: "#888",
              borderRadius: "4px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            style={{
              fontSize: "12px",
              padding: "6px 12px",
              backgroundColor: "#007EA7",
              color: "#fff",
              borderRadius: "4px",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentList;
