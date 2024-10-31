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
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [courseData, setCourseData] = useState({
    courseName: "",
    courseCode: "",
    courseNumber: "",
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

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/courses/allCourses");
      setCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/instructors/instructors");
      setInstructors(response.data || []);
    } catch (error) {
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
      courseNumber: "",
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
      courseNumber: course.courseNumber,
      description: course.description,
      term: course.term,
    });
    setSections(course.sections || []);
    setEditingCourseId(course._id);
    setShowModal(true);
    setShowSavedView(false);
  };

  const saveCourse = async () => {
    try {
      if (editingCourseId) {
        await axios.put(`http://localhost:3001/api/courses/${editingCourseId}`, {
          ...courseData,
          sections: sections.map((section) => ({
            sectionName: section.sectionName,
            instructor: section.instructor ? section.instructor._id || section.instructor : null,
          })),
        });
        toast.success("Course updated successfully!");
      } else {
        const response = await axios.post("http://localhost:3001/api/courses/add", {
          ...courseData,
          sections: sections.map((section) => ({
            sectionName: section.sectionName,
            instructor: section.instructor ? section.instructor._id || section.instructor : null,
          })),
        });
        setCourses([...courses, response.data]);
        toast.success("Course added successfully!");
      }
      fetchCourses();
      setShowSavedView(true);
    } catch (error) {
      toast.error("Failed to save course.");
    }
  };

  const closeDialog = () => {
    setShowModal(false);
    setShowSavedView(false);
    setCourseData({
      courseName: "",
      courseCode: "",
      courseNumber: "",
      description: "",
      term: "",
    });
    setSections([]);
  };

  return (
    <div style={{ fontSize: "12px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" sx={{ fontSize: "12px" }}>
          Courses
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={openAddCourseModal}
          sx={{ fontSize: "12px" }}
        >
          Add Course
        </Button>
      </Box>

      <Dialog open={showModal} onClose={closeDialog} maxWidth="xs" fullWidth scroll="paper">
        <DialogTitle sx={{ fontSize: "12px" }}>
          {showSavedView ? "Saved Course Details" : editingCourseId ? "Edit Course" : "Add Course"}
        </DialogTitle>
        <DialogContent dividers sx={{ padding: "16px", fontSize: "12px" }}>
          {!showSavedView ? (
            <Box component="form" noValidate autoComplete="off">
              <TextField
                label="Course Name"
                name="courseName"
                value={courseData.courseName}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                size="small"
                sx={{ fontSize: "12px" }}
              />
              <TextField
                label="Course Code"
                name="courseCode"
                value={courseData.courseCode}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                size="small"
                sx={{ fontSize: "12px" }}
              />
              <TextField
                label="Course Number"
                name="courseNumber"
                value={courseData.courseNumber}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                type="number"
                size="small"
                sx={{ fontSize: "12px" }}
              />
              <TextField
                label="Term"
                name="term"
                value={courseData.term}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                size="small"
                sx={{ fontSize: "12px" }}
              />
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
                sx={{ fontSize: "12px" }}
              />

              <Divider sx={{ marginY: 2 }} />
              <Typography variant="h6" sx={{ fontSize: "12px", marginBottom: 1 }}>Sections</Typography>
              {sections.map((section, index) => (
                <Box key={index} sx={{ marginBottom: 1 }}>
                  <TextField
                    label={`Section ${index + 1} Name`}
                    value={section.sectionName}
                    onChange={(e) => handleSectionChange(index, "sectionName", e.target.value)}
                    fullWidth
                    margin="dense"
                    size="small"
                    sx={{ fontSize: "12px" }}
                  />
                  <FormControl fullWidth margin="dense" size="small">
                    <InputLabel sx={{ fontSize: "12px" }}>Instructor</InputLabel>
                    <Select
                      value={section.instructor?._id || section.instructor || ""}
                      onChange={(e) => handleSectionChange(index, "instructor", e.target.value)}
                      sx={{ fontSize: "12px" }}
                    >
                      {instructors.map((instructor) => (
                        <MenuItem key={instructor._id} value={instructor._id} sx={{ fontSize: "12px" }}>
                          {instructor.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton
                    color="secondary"
                    onClick={() => removeSection(index)}
                    sx={{ padding: "4px", fontSize: "12px" }}
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
                fullWidth
                size="small"
                sx={{ fontSize: "12px" }}
              >
                Add Section
              </Button>
            </Box>
          ) : (
            <Box sx={{ fontSize: "12px" }}>
              <Typography variant="h6" sx={{ fontSize: "12px" }}>Course: {courseData.courseName}</Typography>
              <Typography sx={{ fontSize: "12px" }}>Code: {courseData.courseCode}</Typography>
              <Typography sx={{ fontSize: "12px" }}>Number: {courseData.courseNumber}</Typography>
              <Typography sx={{ fontSize: "12px" }}>Term: {courseData.term}</Typography>
              <Typography sx={{ fontSize: "12px" }}>Description: {courseData.description}</Typography>
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="h6" sx={{ fontSize: "12px", marginBottom: 1 }}>Sections</Typography>
              {sections.map((section, index) => (
                <Box key={index} sx={{ marginY: 1, fontSize: "12px" }}>
                  <Typography sx={{ fontSize: "12px" }}>Section {index + 1}: {section.sectionName}</Typography>
                  <Typography sx={{ fontSize: "12px" }}>
                    Instructor:{" "}
                    {section.instructor?.name ||
                      instructors.find((inst) => inst._id === section.instructor)?.name ||
                      "Not assigned"}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {showSavedView ? (
            <Button onClick={closeDialog} color="primary" sx={{ fontSize: "12px" }}>Close</Button>
          ) : (
            <>
              <Button onClick={saveCourse} variant="contained" color="primary" sx={{ fontSize: "12px" }}>Save</Button>
              <Button onClick={closeDialog} color="secondary" sx={{ fontSize: "12px" }}>Cancel</Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <table className="table table-bordered mt-4" style={{ fontSize: "12px" }}>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Course Code</th>
            <th>Course Number</th>
            <th>Term</th>
            <th>Description</th>
            <th>Sections</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>{course.courseName}</td>
              <td>{course.courseCode}</td>
              <td>{course.courseNumber}</td>
              <td>{course.term}</td>
              <td>{course.description}</td>
              <td>
                {(course.sections || []).map((section, index) => (
                  <div key={index} style={{ fontSize: "12px" }}>
                    <strong>{section.sectionName}</strong> -{" "}
                    {section.instructor?.name || "No instructor assigned"}
                  </div>
                ))}
              </td>
              <td>
                <IconButton color="primary" onClick={() => openEditCourseModal(course)} sx={{ fontSize: "12px" }}>
                  <Edit fontSize="small" />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default Courses;
