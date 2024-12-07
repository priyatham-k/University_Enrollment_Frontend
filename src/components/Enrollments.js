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
  Box,
} from "@mui/material";

const Enrollments = () => {
  const [groupedEnrollments, setGroupedEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/enrollment/all");

        // Group enrollments by student
        const grouped = response.data.reduce((acc, enrollment) => {
          const { studentName, courseName, sectionName } = enrollment;
          const student = acc.find((item) => item.studentName === studentName);
          const courseSection = `${courseName} ${sectionName}`;

          if (student) {
            student.courses.push(courseSection);
          } else {
            acc.push({
              studentName,
              courses: [courseSection],
            });
          }

          return acc;
        }, []);

        setGroupedEnrollments(grouped);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
        setError("Failed to fetch enrollment data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Typography style={{ fontSize: "12px", color: "#888" }}>Loading...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Typography style={{ fontSize: "12px", color: "red" }}>{error}</Typography>
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
        Enrollment List
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
          aria-label="enrollment table"
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
                Student Name
              </TableCell>
              <TableCell
                align="left"
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  border: "1px solid #ccc",
                }}
              >
                Enrolled Courses
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedEnrollments.length > 0 ? (
              groupedEnrollments.map((student) => (
                <TableRow key={student.studentName}>
                  <TableCell
                    align="left"
                    style={{
                      fontSize: "12px",
                      border: "1px solid #ccc",
                    }}
                  >
                    {student.studentName}
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      fontSize: "12px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <Box
                      component="ul"
                      style={{
                        padding: 0,
                        margin: 0,
                        listStyleType: "none",
                      }}
                    >
                      {student.courses.map((course, index) => (
                        <li key={index} style={{ marginBottom: "4px" }}>
                          {course}
                        </li>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  align="center"
                  style={{
                    fontSize: "12px",
                    border: "1px solid #ccc",
                    color: "#888",
                  }}
                >
                  No enrollments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Enrollments;
