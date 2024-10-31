import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    role: "instructor",
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
    setFormData({ name: "", email: "", password: "", department: "", role: "instructor" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || (!isEditing && !formData.password) || !formData.department) {
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
              instructor._id === editingInstructorId ? response.data.instructor : instructor
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
      password: "",
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
    <div style={{ fontSize: "12px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 style={{ fontSize: "12px" }}>Instructors List</h1>
        <button className="btn btn-primary" onClick={handleOpenModal} style={{ fontSize: "12px" }}>
          Add Instructor
        </button>
      </div>

      {instructors.length === 0 ? (
        <div className="alert alert-info" style={{ fontSize: "12px" }}>
          No instructors found.
        </div>
      ) : (
        <table className="table table-bordered" style={{ fontSize: "12px" }}>
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
                    className="btn btn-warning me-2"
                    style={{ width: "67px", height: "30px", padding: "0px", fontSize: "12px" }}
                    onClick={() => handleEdit(instructor)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ width: "67px", height: "30px", padding: "0px", fontSize: "12px" }}
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

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ fontSize: "12px" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ fontSize: "12px" }}>
                  {isEditing ? "Edit Instructor" : "Add Instructor"}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label" style={{ fontSize: "12px" }}>
                      Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isEditing}
                      style={{ fontSize: "12px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{ fontSize: "12px" }}>
                      Email:
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{ fontSize: "12px" }}
                    />
                  </div>
                  {!isEditing && (
                    <div className="mb-3">
                      <label className="form-label" style={{ fontSize: "12px" }}>
                        Password:
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ fontSize: "12px" }}
                      />
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label" style={{ fontSize: "12px" }}>
                      Department:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      style={{ fontSize: "12px" }}
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary me-2" style={{ fontSize: "12px" }}>
                      {isEditing ? "Update Instructor" : "Add Instructor"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                      style={{ fontSize: "12px" }}
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

      <ToastContainer />
    </div>
  );
}

export default Instructors;
