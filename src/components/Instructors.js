import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for Toastify

function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingInstructorId, setEditingInstructorId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/instructors/instructors")
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
    setFormData({ name: "", email: "", password: "", department: "" });
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
      !formData.name ||
      !formData.email ||
      (!isEditing && !formData.password) ||
      !formData.department
    ) {
      toast.error("All fields are required");
      return;
    }

    if (isEditing) {
      axios
        .put(`http://localhost:3001/api/instructors/instructors/${editingInstructorId}`, formData)
        .then((response) => {
          toast.success("Instructor updated successfully");
          setInstructors(
            instructors.map((instructor) =>
              instructor._id === editingInstructorId
                ? response.data.instructor
                : instructor
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
      name: instructor.name,
      email: instructor.email,
      password: "", // Reset password field (not editable here)
      department: instructor.department,
    });
    handleOpenModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this instructor?")) {
      axios
        .delete(`http://localhost:3001/api/instructors/instructors/${id}`)
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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Instructors List</h1>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          Add Instructor
        </button>
      </div>

      {/* Instructors Table */}
      {instructors.length === 0 ? (
        <div className="alert alert-info">No instructors found.</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor) => (
              <tr key={instructor._id}>
                <td>{instructor.name}</td>
                <td>{instructor.email}</td>
                <td>{instructor.department}</td>
                <td>
                  <button
                    className="btn btn-warning me-2" style={{ width: "67px", height: "30px", padding: "0px" }}
                    onClick={() => handleEdit(instructor)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger" style={{ width: "67px", height: "30px", padding: "0px" }}
                    onClick={() => handleDelete(instructor._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Popup */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditing ? "Edit Instructor" : "Add Instructor"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isEditing}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {!isEditing && (
                    <div className="mb-3">
                      <label className="form-label">Password:</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Department:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary me-2">
                      {isEditing ? "Update Instructor" : "Add Instructor"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default Instructors;
