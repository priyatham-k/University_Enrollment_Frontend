// EditCourse.js
import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { Add, Delete } from "@mui/icons-material";

const EditCourse = ({ courseId, open, onClose, onSave }) => {
  const [courseData, setCourseData] = useState({
    courseName: "",
    courseCode: "",
    courseNumber: "",
    description: "",
    term: "",
  });
  const [sections, setSections] = useState([]);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    fetchCourseData();
    fetchInstructors();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/courses/${courseId}`);
      setCourseData({
        courseName: response.data.courseName,
        courseCode: response.data.courseCode,
        courseNumber: response.data.courseNumber,
        description: response.data.description,
        term: response.data.term,
      });
      setSections(response.data.sections);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/instructors/all");
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

  const saveChanges = async () => {
    try {
      await axios.put(`http://localhost:3001/api/courses/${courseId}`, {
        ...courseData,
        sections: sections.map((section) => ({
          sectionName: section.sectionName,
          instructor: section.instructor || null,
        })),
      });
      onSave(); // Refresh parent data on save
      onClose(); // Close the dialog after saving
    } catch (error) {
      console.error("Error saving course changes:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Course</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Course Name"
          name="courseName"
          value={courseData.courseName}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Course Code"
          name="courseCode"
          value={courseData.courseCode}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Course Number"
          name="courseNumber"
          value={courseData.courseNumber}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          type="number"
        />
        <TextField
          label="Term"
          name="term"
          value={courseData.term}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Description"
          name="description"
          value={courseData.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={3}
          margin="dense"
        />

        <Divider sx={{ marginY: 2 }} />
        <Typography variant="h6" gutterBottom>Sections</Typography>
        {sections.map((section, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <TextField
              label={`Section ${index + 1} Name`}
              value={section.sectionName}
              onChange={(e) => handleSectionChange(index, "sectionName", e.target.value)}
              fullWidth
              margin="dense"
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Instructor</InputLabel>
              <Select
                value={section.instructor}
                onChange={(e) => handleSectionChange(index, "instructor", e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {instructors.map((instructor) => (
                  <MenuItem key={instructor._id} value={instructor._id}>
                    {instructor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton color="secondary" onClick={() => removeSection(index)}>
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Button variant="outlined" onClick={addSection} startIcon={<Add />} fullWidth>
          Add Section
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={saveChanges} color="primary" variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCourse;
