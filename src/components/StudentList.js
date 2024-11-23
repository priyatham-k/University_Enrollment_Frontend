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
} from "@mui/material";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <Typography
        variant="h6"
        gutterBottom
        style={{
          fontSize: "12px",
          fontWeight: "bold",
          marginBottom: "16px",
          color: "#0D3B66", // University-themed dark blue
        }}
      >
        Student List
      </Typography>
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
              <TableCell
                align="left"
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  border: "1px solid #ccc",
                }}
              >
                Full Name
              </TableCell>
              <TableCell
                align="left"
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  border: "1px solid #ccc",
                }}
              >
                Username
              </TableCell>
              <TableCell
                align="left"
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  border: "1px solid #ccc",
                }}
              >
                Email
              </TableCell>
              <TableCell
                align="left"
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  border: "1px solid #ccc",
                }}
              >
                Phone Number
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell
                    align="left"
                    style={{
                      fontSize: "12px",
                      border: "1px solid #ccc",
                    }}
                  >
                    {student.fullname}
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      fontSize: "12px",
                      border: "1px solid #ccc",
                    }}
                  >
                    {student.username}
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      fontSize: "12px",
                      border: "1px solid #ccc",
                    }}
                  >
                    {student.email}
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      fontSize: "12px",
                      border: "1px solid #ccc",
                    }}
                  >
                    {student.phone || "Not provided"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  style={{
                    fontSize: "12px",
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
    </div>
  );
};

export default StudentList;
