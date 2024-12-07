import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
  Box,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [courseData, setCourseData] = useState({
    courseName: "",
    courseCode: "",
    description: "",
    term: "",
  });
  const [sections, setSections] = useState([]);
  const [showSavedView, setShowSavedView] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  // Fetch all courses API
  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/courses/all");
      setCourses(response.data || []);
    } catch (error) {
      toast.error("Error fetching courses.");
      console.error("Error fetching courses:", error);
    }
  };

  // Fetch all instructors API
  const fetchInstructors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/instructors/all"
      );
      setInstructors(response.data || []);
    } catch (error) {
      toast.error("Error fetching instructors.");
      console.error("Error fetching instructors:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setSections(updatedSections);
  };

  const addSection = () => {
    setSections([...sections, { sectionName: "", instructor: "" }]);
  };

  const removeSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const openAddCourseModal = () => {
    setCourseData({
      courseName: "",
      courseCode: "",
      description: "",
      term: "",
    });
    setSections([]);
    setEditingCourseId(null);
    setShowModal(true);
    setShowSavedView(false);
  };

  const openEditCourseModal = (course) => {
    setCourseData({
      courseName: course.courseName,
      courseCode: course.courseCode,
      description: course.description,
      term: course.term,
    });
    setSections(course.sections || []);
    setEditingCourseId(course._id);
    setShowModal(true);
    setShowSavedView(false);
  };

  // Save Course API (Add or Edit)
  const saveCourse = async () => {
    try {
      if (editingCourseId) {
        await axios.put(
          `http://localhost:3001/api/courses/${editingCourseId}`,
          {
            ...courseData,
            sections: sections.map((section) => ({
              sectionName: section.sectionName,
              instructor: section.instructor
                ? section.instructor._id || section.instructor
                : null,
            })),
          }
        );
        toast.success("Course updated successfully!");
      } else {
        const response = await axios.post(
          "http://localhost:3001/api/courses/add",
          {
            ...courseData,
            sections: sections.map((section) => ({
              sectionName: section.sectionName,
              instructor: section.instructor
                ? section.instructor._id || section.instructor
                : null,
            })),
          }
        );
        setCourses([...courses, response.data]);
        toast.success("Course added successfully!");
      }
      fetchCourses();
      setShowSavedView(true);
    } catch (error) {
      toast.error("Failed to save course.");
      console.error("Error saving course:", error);
    }
  };

  // Delete Course API
  const deleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`http://localhost:3001/api/courses/${courseId}`);
        toast.success("Course deleted successfully!");
        fetchCourses();
      } catch (error) {
        toast.error("Failed to delete course.");
        console.error("Error deleting course:", error);
      }
    }
  };

  const closeDialog = () => {
    setShowModal(false);
    setShowSavedView(false);
    setCourseData({
      courseName: "",
      courseCode: "",
      description: "",
      term: "",
    });
    setSections([]);
  };

  return (
    <div style={{ fontSize: "12px" }}>
      <Card
        style={{
          marginBottom: "20px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <CardHeader
          title={
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#0D3B66",
                }}
              >
                Courses List
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={openAddCourseModal}
                style={{ fontSize: "12px" }}
              >
                Add Course
              </Button>
            </Box>
          }
          style={{ paddingBottom: 0 }}
        />
        <CardContent style={{ paddingTop: 0 }}>
          {courses.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: "#888",
                padding: "16px",
              }}
            >
              No courses available.
            </div>
          ) : (
            <table
              className="table table-bordered mt-4"
              style={{
                fontSize: "12px",
                textAlign: "left",
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f1f1f1", color: "#333" }}>
                  <th style={{ padding: "8px" }}>Course Name</th>
                  <th style={{ padding: "8px" }}>Course Code</th>
                  <th style={{ padding: "8px" }}>Term</th>
                  <th style={{ padding: "8px" }}>Description</th>
                  <th style={{ padding: "8px" }}>
                    Sections (Day & Time) - Instructor
                  </th>
                  <th style={{ padding: "8px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td style={{ padding: "8px" }}>{course.courseName}</td>
                    <td style={{ padding: "8px" }}>{course.courseCode}</td>
                    <td style={{ padding: "8px" }}>{course.term}</td>
                    <td style={{ padding: "8px" }}>{course.description}</td>
                    <td style={{ padding: "8px" }}>
                      {course.sections && course.sections.length > 0 ? (
                        course.sections.map((section, index) => (
                          <div key={index} style={{ fontSize: "12px" }}>
                            <strong>
                              {section.sectionName || "Unnamed Section"}
                            </strong>{" "}
                            -{" "}
                            {section.instructor
                              ? `${
                                  section.instructor.firstName ||
                                  "No first name"
                                } ${
                                  section.instructor.lastName || "No last name"
                                }`
                              : "No instructor assigned"}
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: "12px", color: "#999" }}>
                          No sections available for this course.
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "8px" }}>
                      <IconButton
                        color="primary"
                        onClick={() => openEditCourseModal(course)}
                        style={{ fontSize: "12px" }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => deleteCourse(course._id)}
                        style={{ fontSize: "12px" }}
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

      <Dialog open={showModal} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle style={{ fontSize: "12px" }}>
          {showSavedView
            ? "Saved Course Details"
            : editingCourseId
            ? "Edit Course"
            : "Add Course"}
        </DialogTitle>
        <DialogContent style={{ fontSize: "12px" }}>
          {!showSavedView ? (
            <Box>
              <TextField
                label="Course Name"
                name="courseName"
                value={courseData.courseName}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                size="small"
                style={{ fontSize: "12px" }}
              />
              <TextField
                label="Course Code"
                name="courseCode"
                value={courseData.courseCode}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                size="small"
                style={{ fontSize: "12px" }}
              />

              <FormControl fullWidth margin="dense" size="small">
                <InputLabel style={{ fontSize: "12px", padding: "2px" }}>
                  Term
                </InputLabel>
                <Select
                  name="term"
                  value={courseData.term}
                  onChange={handleInputChange}
                  style={{ fontSize: "12px", padding: "2px" }}
                >
                  <MenuItem value="Spring 2025" style={{ fontSize: "12px" }}>
                    Spring 2025
                  </MenuItem>
                  <MenuItem value="Summer 2025" style={{ fontSize: "12px" }}>
                    Summer 2025
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Description"
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
                margin="dense"
                size="small"
                style={{ fontSize: "12px" }}
              />
              <Divider style={{ margin: "12px 0" }} />
              <Typography style={{ fontSize: "12px", fontWeight: "bold" }}>
                Sections
              </Typography>
              {sections.map((section, index) => (
                <Box
                  key={index}
                  style={{ marginBottom: "8px", fontSize: "12px" }}
                >
                  <TextField
                    label={`Course Number (Day & Time)`}
                    value={section.sectionName}
                    onChange={(e) =>
                      handleSectionChange(index, "sectionName", e.target.value)
                    }
                    fullWidth
                    margin="dense"
                    size="small"
                    style={{ fontSize: "12px" }}
                  />
                  <FormControl fullWidth margin="dense" size="small">
                    <InputLabel style={{ fontSize: "12px" }}>
                      Instructor
                    </InputLabel>
                    <Select
                      value={
                        section.instructor?._id || section.instructor || ""
                      }
                      onChange={(e) =>
                        handleSectionChange(index, "instructor", e.target.value)
                      }
                      style={{ fontSize: "12px" }}
                    >
                      {instructors.map((instructor) => (
                        <MenuItem
                          key={instructor._id}
                          value={instructor._id}
                          style={{ fontSize: "12px" }}
                        >
                          {instructor.firstName} {instructor.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton
                    color="secondary"
                    onClick={() => removeSection(index)}
                    style={{ fontSize: "12px", padding: "4px" }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                color="primary"
                onClick={addSection}
                startIcon={<Add />}
                size="small"
                fullWidth
                style={{ fontSize: "12px" }}
              >
                Add Section
              </Button>
            </Box>
          ) : (
            <Box style={{ fontSize: "12px" }}>
              <Typography style={{ fontSize: "12px", fontWeight: "bold" }}>
                Course: {courseData.courseName}
              </Typography>
              <Typography style={{ fontSize: "12px" }}>
                Code: {courseData.courseCode}
              </Typography>

              <Typography style={{ fontSize: "12px" }}>
                Term: {courseData.term}
              </Typography>
              <Typography style={{ fontSize: "12px" }}>
                Description: {courseData.description}
              </Typography>
              <Divider style={{ margin: "12px 0" }} />
              <Typography style={{ fontSize: "12px", fontWeight: "bold" }}>
                Sections
              </Typography>
              {sections.map((section, index) => (
                <Box
                  key={index}
                  style={{ marginBottom: "8px", fontSize: "12px" }}
                >
                  <Typography style={{ fontSize: "12px" }}>
                    Course Number: {section.sectionName}
                  </Typography>
                  <Typography style={{ fontSize: "12px" }}>
                    Instructor:{" "}
                    {section.instructor?.firstName ||
                      instructors.find(
                        (inst) => inst._id === section.instructor
                      )?.firstName ||
                      "Not assigned"}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {showSavedView ? (
            <Button
              onClick={closeDialog}
              color="primary"
              style={{ fontSize: "12px" }}
            >
              Close
            </Button>
          ) : (
            <>
              <Button
                onClick={saveCourse}
                variant="contained"
                color="primary"
                style={{ fontSize: "12px" }}
              >
                Save
              </Button>
              <Button
                onClick={closeDialog}
                color="secondary"
                style={{ fontSize: "12px" }}
              >
                Cancel
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Courses;
