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

const Payments = () => {
  const [groupedPayments, setGroupedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/payments/all"
        );

        // Group payments by student
        const grouped = response.data.reduce((acc, payment) => {
          const { studentName, courseName, amount } = payment;
          const student = acc.find((item) => item.studentName === studentName);

          const coursePayment = `${courseName}: $${amount.toFixed(2)}`;

          if (student) {
            student.payments.push(coursePayment);
            student.total += amount;
          } else {
            acc.push({
              studentName,
              payments: [coursePayment],
              total: amount,
            });
          }

          return acc;
        }, []);

        setGroupedPayments(grouped);

        // Calculate total amount
        const total = response.data.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );
        setTotalAmount(total);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to fetch payment data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
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
        Payment Records
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
          aria-label="payment table"
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
                Payments (Course: Amount)
              </TableCell>
              <TableCell
                align="left"
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  border: "1px solid #ccc",
                }}
              >
                Total Paid
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedPayments.length > 0 ? (
              groupedPayments.map((student) => (
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
                      {student.payments.map((payment, index) => (
                        <li key={index} style={{ marginBottom: "4px" }}>
                          {payment}
                        </li>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      fontSize: "12px",
                      border: "1px solid #ccc",
                      fontWeight: "bold",
                    }}
                  >
                    ${student.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  style={{
                    fontSize: "12px",
                    border: "1px solid #ccc",
                    color: "#888",
                  }}
                >
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography
        style={{
          marginTop: "16px",
          fontSize: "12px",
          fontWeight: "bold",
          color: "#0D3B66",
        }}
      >
        Total Fees Collected: ${totalAmount.toFixed(2)}
      </Typography>
    </div>
  );
};

export default Payments;
