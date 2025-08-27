/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Accordion, Modal, Button, Spinner } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "./SharedStyles.css"; // Make sure you have the corresponding CSS file

// It's a good practice to have the API base URL in a constant
const API_URL = "http://localhost:8000/api/v1/students/";

export default function StudentData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", branch: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to fetch student data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.branch) {
        toast.warn("Please fill in all fields.");
        return;
    }
    try {
      await axios.post(API_URL, newStudent);
      toast.success("Student added successfully!");
      setNewStudent({ name: "", branch: "" });
      fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to add student.");
    }
  };

  const handleView = async (id) => {
    try {
      const response = await axios.get(`${API_URL}${id}/`);
      setSelectedStudent(response.data);
      setIsEditing(false);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Could not fetch student details.");
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`${API_URL}${id}/`);
      setSelectedStudent(response.data);
      setIsEditing(true);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Could not fetch student details.");
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}${selectedStudent.student_id}/`, selectedStudent);
      toast.success("Student details updated!");
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Failed to update student.");
    }
  };

  const handleDelete = async (id) => {
    // A non-blocking confirmation modal would be even better, but window.confirm is simple
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      toast.info("Student deleted.");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student.");
    }
  };

  const closeModal = () => setShowModal(false);

  const filteredData = data.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
        <h4 className="ms-3">Loading Students...</h4>
      </div>
    );
  }

  return (
    <div className="page-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      
            
      <div className="header-container text-center">
        <h1 className="display-4 fw-bold">Student Management Portal</h1>
        <p className="lead">A modern interface for managing student records.</p>
      </div>

      <Accordion className="mb-4 shadow-sm">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <i className="bi bi-person-plus-fill me-2"></i> Add New Student
          </Accordion.Header>
          <Accordion.Body>
            <form onSubmit={handleAddStudent}>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Student Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} required />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Branch" value={newStudent.branch} onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })} required />
              </div>
              <Button type="submit" className="btn-gradient">
                Add Student
              </Button>
            </form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="mb-4">
        <input type="text" className="form-control" placeholder="🔍 Search by student name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <motion.div
        className="row g-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {filteredData.length > 0 ? (
            filteredData.map((student) => (
              <motion.div
                key={student.student_id}
                className="col-lg-6 col-md-6"
                variants={itemVariants}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="card h-100 data-card">
                  <div className="card-body d-flex align-items-center">
                    <div className="avatar me-3">{student.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <h5 className="card-title mb-1">{student.name}</h5>
                      <p className="card-text text-muted">{student.branch}</p>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-0 text-end pb-3">
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleView(student.student_id)}>
                      <i className="bi bi-eye me-1"></i>View
                    </Button>
                    <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEdit(student.student_id)}>
                      <i className="bi bi-pencil me-1"></i>Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(student.student_id)}>
                      <i className="bi bi-trash me-1"></i>Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-12 text-center text-muted mt-5">
              <h4>No students found.</h4>
              <p>Try clearing your search or adding a new student.</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Student" : "Student Details"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (isEditing ? (
            <>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" value={selectedStudent.name} onChange={(e) => setSelectedStudent({ ...selectedStudent, name: e.target.value })}/>
              </div>
              <div>
                <label className="form-label">Branch</label>
                <input type="text" className="form-control" value={selectedStudent.branch} onChange={(e) => setSelectedStudent({ ...selectedStudent, branch: e.target.value })}/>
              </div>
            </>
          ) : (
            <>
              <p><strong>ID:</strong> {selectedStudent.student_id}</p>
              <p><strong>Name:</strong> {selectedStudent.name}</p>
              <p><strong>Branch:</strong> {selectedStudent.branch}</p>
            </>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            {isEditing ? "Cancel" : "Close"}
          </Button>
          {isEditing && (
            <Button className="btn-gradient" onClick={handleSave}>
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
