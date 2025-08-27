import React, { useEffect, useState } from "react";
import axios from "axios";
import { Accordion, Modal, Button, Spinner } from "react-bootstrap";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "./SharedStyles.css"; // Using the updated CSS

const API_URL = "http://127.0.0.1:8000/api/v1/employees/";

export default function EmployeesData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ emp_name: "", emp_role: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      toast.error("Failed to fetch employee data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.emp_name || !newEmployee.emp_role) {
      toast.warn("Please fill in all fields.");
      return;
    }
    try {
      await axios.post(API_URL, newEmployee);
      toast.success("Employee added successfully!");
      setNewEmployee({ emp_name: "", emp_role: "" });
      fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee.");
    }
  };

  const handleView = async (id) => {
    try {
      const response = await axios.get(`${API_URL}${id}/`);
      setSelectedEmployee(response.data);
      setIsEditing(false);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Could not fetch employee details.");
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`${API_URL}${id}/`);
      setSelectedEmployee(response.data);
      setIsEditing(true);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Could not fetch employee details.");
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}${selectedEmployee.emp_id}/`, selectedEmployee);
      toast.success("Employee details updated!");
      setShowModal(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      toast.info("Employee deleted.");
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setIsEditing(false);
  };

  const filteredData = data.filter((employee) =>
    employee.emp_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
        <h4 className="ms-3">Loading Employees...</h4>
      </div>
    );
  }

  return (
    <div className="page-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="header-container text-center">
        <h1 className="display-4 fw-bold">Employee Management</h1>
        <p className="lead">A modern interface for managing employee records.</p>
      </div>

      <Accordion className="mb-4 shadow-sm">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <i className="bi bi-person-plus-fill me-2"></i> Add New Employee
          </Accordion.Header>
          <Accordion.Body>
            <form onSubmit={handleAddEmployee}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Employee Name"
                  value={newEmployee.emp_name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, emp_name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Role"
                  value={newEmployee.emp_role}
                  onChange={(e) => setNewEmployee({ ...newEmployee, emp_role: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="btn-gradient">Add Employee</Button>
            </form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by employee name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <motion.div className="row g-4" variants={containerVariants} initial="hidden" animate="visible">
        <AnimatePresence>
          {filteredData.length > 0 ? (
            filteredData.map((employee) => (
              <motion.div key={employee.emp_id} className="col-lg-6 col-md-6" variants={itemVariants} exit={{ opacity: 0, scale: 0.8 }}>
                <div className="card h-100 data-card">
                  <div className="card-body d-flex align-items-center">
                    <div className="avatar me-3">{employee.emp_name.charAt(0).toUpperCase()}</div>
                    <div>
                      <h5 className="card-title mb-1">{employee.emp_name}</h5>
                      <p className="card-text text-muted">{employee.emp_role}</p>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-0 text-end pb-3">
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleView(employee.emp_id)}>
                      <i className="bi bi-eye me-1"></i>View
                    </Button>
                    <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEdit(employee.emp_id)}>
                      <i className="bi bi-pencil me-1"></i>Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(employee.emp_id)}>
                      <i className="bi bi-trash me-1"></i>Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-12 text-center text-muted mt-5">
              <h4>No employees found.</h4>
              <p>Try clearing your search or adding a new employee.</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Employee" : "Employee Details"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee && (isEditing ? (
            <>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEmployee.emp_name}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, emp_name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEmployee.emp_role}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, emp_role: e.target.value })}
                />
              </div>
            </>
          ) : (
            <>
              <p><strong>ID:</strong> {selectedEmployee.emp_id}</p>
              <p><strong>Name:</strong> {selectedEmployee.emp_name}</p>
              <p><strong>Role:</strong> {selectedEmployee.emp_role}</p>
            </>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>{isEditing ? "Cancel" : "Close"}</Button>
          {isEditing && <Button className="btn-gradient" onClick={handleSave}>Save Changes</Button>}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
