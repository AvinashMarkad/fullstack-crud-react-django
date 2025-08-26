import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // For modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // For add student form
  const [newStudent, setNewStudent] = useState({ name: "", branch: "" });

  // For search
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/students/"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/v1/students/", newStudent);
      alert("Student added successfully!");
      setNewStudent({ name: "", branch: "" }); // clear form
      fetchStudents(); // refresh list
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student.");
    }
  };

  // View student details
  const handleView = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/students/${id}/`
      );
      setSelectedStudent(response.data);
      setIsEditing(false);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  // Edit student details
  const handleEdit = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/students/${id}/`
      );
      setSelectedStudent(response.data);
      setIsEditing(true);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  // Save changes (update)
  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/v1/students/${selectedStudent.student_id}/`,
        selectedStudent
      );
      alert("Student details updated successfully!");
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student.");
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/api/v1/students/${id}/`);
      alert("Student deleted successfully!");
      fetchStudents(); // refresh list
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setIsEditing(false);
  };

  if (loading) {
    return <p>Loading student data...</p>;
  }

  // ✅ Filter students by search term
  const filteredData = data.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1 className="display-3 mb-5">Student Data</h1>

      {/* ✅ Add Student Form */}
      <form className="mb-3 border p-4" onSubmit={handleAddStudent}>
        <h3 className="mb-3">Add New Student</h3>
        <div className="mb-3">
          <label htmlFor="studentName" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="studentName"
            value={newStudent.name}
            onChange={(e) =>
              setNewStudent({ ...newStudent, name: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="studentBranch" className="form-label">
            Branch
          </label>
          <input
            type="text"
            className="form-control"
            id="studentBranch"
            value={newStudent.branch}
            onChange={(e) =>
              setNewStudent({ ...newStudent, branch: e.target.value })
            }
            required
          />
        </div>

        <button type="submit" className="btn btn-success">
          Add Student
        </button>
      </form>

      {/* ✅ Search Input */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by student name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Student List */}
      {filteredData.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">Sr.No</th>
              <th scope="col">Name</th>
              <th scope="col">View Details</th>
              <th scope="col">Edit Details</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((student, index) => (
              <tr key={student.student_id}>
                <th scope="row">{index + 1}</th>
                <td>{student.name}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={() => handleView(student.student_id)}
                  >
                    View
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    onClick={() => handleEdit(student.student_id)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => handleDelete(student.student_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for View/Edit */}
      {showModal && selectedStudent && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditing ? "Edit Student" : "Student Details"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                {isEditing ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedStudent.name}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Branch</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedStudent.branch}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            branch: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>ID:</strong> {selectedStudent.student_id}
                    </p>
                    <p>
                      <strong>Name:</strong> {selectedStudent.name}
                    </p>
                    <p>
                      <strong>Branch:</strong> {selectedStudent.branch}
                    </p>
                  </>
                )}
              </div>
              <div className="modal-footer">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleSave}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
