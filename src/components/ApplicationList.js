import React, { useEffect, useState } from "react";
import axios from "axios";

function ApplicationList() {
  const [applications, setApplications] = useState([]);

  // Fetch all applications from the API
  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/applications");
      setApplications(response.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/applications/approve/${id}`);
      fetchApplications(); // Refresh the list after approving
    } catch (err) {
      console.error("Error approving application:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/applications/reject/${id}`);
      fetchApplications(); // Refresh the list after rejecting
    } catch (err) {
      console.error("Error rejecting application:", err);
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">All Applications</h6>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Degree Program</th>
                <th>Major</th>
                <th>Season</th>
                <th>English Test</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.studentName}</td>
                  <td>{app.contactEmail}</td>
                  <td>{app.degreeProgram}</td>
                  <td>{app.major}</td>
                  <td>{app.season}</td>
                  <td>{app.englishTest}</td>
                  <td><b>{app.applicationStatus}</b></td>
                  <td>
                    {app.applicationStatus === "pending" ? (
                      <>
                        <button
                          className="btn btn-success mr-1"
                          style={{ width: '65px', height: '30px', padding: '0px' }}
                          onClick={() => handleApprove(app._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ width: '67px', height: '30px', padding: '0px' }}
                          onClick={() => handleReject(app._id)}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span>No actions available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ApplicationList;
