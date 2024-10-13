import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [courseData, setCourseData] = useState({
        courseName: '',
        courseCode: '',
        courseNumber: '',
        description: '',
        term:''
    });
    const [instructorToAssign, setInstructorToAssign] = useState({});
    const [changes, setChanges] = useState({});

    useEffect(() => {
        fetchCourses();
        fetchInstructors();
    }, []);

    const fetchCourses = async () => {
        const response = await axios.get('http://localhost:3001/api/courses/allCourses');
        setCourses(response.data);
        const initialInstructors = {};
        response.data.forEach(course => {
            if (course.instructor) {
                initialInstructors[course._id] = course.instructor._id;
            }
        });
        setInstructorToAssign(initialInstructors);
    };

    const fetchInstructors = async () => {
        const response = await axios.get('http://localhost:3001/api/instructors/instructors');
        setInstructors(response.data);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourseData({ ...courseData, [name]: value });
    };

    const addCourse = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/courses/add', courseData);
            setCourses([...courses, response.data]);
            toast.success('Course added successfully!');
            setShowModal(false);
            setCourseData({
                courseName: '',
                courseCode: '',
                courseNumber: '',
                description: '',
                term:''
            });
        } catch (error) {
            toast.error('Failed to add course.');
        }
    };

    const assignInstructor = async (courseId) => {
        try {
            const instructorId = instructorToAssign[courseId];
            if (instructorId) {
                await axios.put(`http://localhost:3001/api/courses/${courseId}/instructor`, { instructorId });
                toast.success('Instructor assigned successfully!');
                fetchCourses();
                setChanges(prev => ({ ...prev, [courseId]: false }));
            } else {
                toast.error('Please select an instructor.');
            }
        } catch (error) {
            toast.error('Failed to assign instructor.');
        }
    };

    const removeInstructor = async (courseId) => {
        try {
            await axios.put(`http://localhost:3001/api/courses/${courseId}/remove-instructor`);
            toast.success('Instructor removed successfully!');
            fetchCourses();
        } catch (error) {
            toast.error('Failed to remove instructor.');
        }
    };

    const deleteCourse = async (courseId) => {
        try {
            await axios.delete(`http://localhost:3001/api/courses/${courseId}`);
            toast.success('Course deleted successfully!');
            fetchCourses();
        } catch (error) {
            toast.error('Failed to delete course.');
        }
    };

    const handleInstructorChange = (courseId, instructorId) => {
        setInstructorToAssign(prev => ({ ...prev, [courseId]: instructorId }));
        setChanges(prev => ({
            ...prev,
            [courseId]: instructorId !== (courses.find(course => course._id === courseId)?.instructor?._id || "")
        }));
    };

    return (
        <div className="">
            <h2>Courses</h2>
            <button className="btn btn-primary float-right mb-4" onClick={() => setShowModal(true)}>
                Add Course
            </button>

            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">Add Course</h3>
                                <button className="close" onClick={() => setShowModal(false)}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    name="courseName"
                                    className="form-control mb-2"
                                    placeholder="Course Name"
                                    value={courseData.courseName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="courseCode"
                                    className="form-control mb-2"
                                    placeholder="Course Code"
                                    value={courseData.courseCode}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="number"
                                    name="courseNumber"
                                    className="form-control mb-2"
                                    placeholder="Course Number"
                                    value={courseData.courseNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                                   <input
                                    type="string"
                                    name="term"
                                    className="form-control mb-2"
                                    placeholder="Term"
                                    value={courseData.term}
                                    onChange={handleInputChange}
                                    required
                                />
                                <textarea
                                    name="description"
                                    className="form-control mb-2"
                                    placeholder="Description"
                                    value={courseData.description}
                                    onChange={handleInputChange} required
                                />
                                <button className="btn btn-primary" onClick={addCourse}>Submit</button>
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <table className="table table-bordered mt-4">
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Course Code</th>
                        <th>Course Number</th>
                        <th>Instructor</th>
                        <th>Actions</th> {/* Add Actions Column */}
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course._id}>
                            <td>{course.courseName}</td>
                            <td>{course.courseCode}</td>
                            <td>{course.courseNumber}</td>
                            <td>
                                <select
                                    className="form-control"
                                    onChange={(e) => handleInstructorChange(course._id, e.target.value)}
                                    value={instructorToAssign[course._id] || ""}
                                >
                                    <option value="" disabled>{course.instructor ? course.instructor.name : "Add Instructor"}</option>
                                    {instructors.map(instructor => (
                                        <option key={instructor._id} value={instructor._id}>
                                            {instructor.name}
                                        </option>
                                    ))}
                                </select>
                                {changes[course._id] && (
                                    <button
                                        className="btn btn-success mt-2"
                                        onClick={() => assignInstructor(course._id)}
                                    >
                                        Save
                                    </button>
                                )}
                            </td>
                            <td>
                                <button className="btn btn-warning btn-sm" onClick={() => removeInstructor(course._id)}>
                                    Remove Instructor
                                </button>
                                <button className="btn btn-danger btn-sm ml-2" onClick={() => deleteCourse(course._id)}>
                                    Delete Course
                                </button>
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
