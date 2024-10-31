import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/user/students");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div>
      <Typography variant="h5" gutterBottom sx={{ fontSize: "16px", marginBottom: "16px" }}>
        <b>Student List</b>
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ border: "1px solid #ccc" }}>
        <Table sx={{ minWidth: 650, borderCollapse: "collapse" }} aria-label="student table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px", border: "1px solid #ccc" }}>Username</TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px", border: "1px solid #ccc" }}>Role</TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px", border: "1px solid #ccc" }}>Enrolled Courses (Course Name - Section)</TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold", fontSize: "12px", border: "1px solid #ccc" }}>Payment Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell align="left" sx={{ fontSize: "12px", border: "1px solid #ccc" }}>{student.username}</TableCell>
                <TableCell align="left" sx={{ fontSize: "12px", border: "1px solid #ccc" }}>{student.role}</TableCell>
                <TableCell align="left" sx={{ fontSize: "12px", border: "1px solid #ccc" }}>
                  {student.payment.length > 0
                    ? student.payment.map((payment) => `${payment.courseName} - ${payment.sectionName}`).join(", ")
                    : "No courses enrolled"}
                </TableCell>
                <TableCell align="left" sx={{ fontSize: "12px", border: "1px solid #ccc" }}>
                  {student.payment.length > 0
                    ? student.payment.map((payment) => `$${payment.amount}`).join(", ")
                    : "No payments"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StudentList;
