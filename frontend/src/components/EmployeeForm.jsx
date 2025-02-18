import React, { useState, useEffect } from "react";
import axios from "axios";
const EmployeeForm = ({
  showModal,
  setShowModal,
  employeeData,
  refreshData,
}) => {
  const [employeeName, setEmployeeName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");
  const [errors, setErrors] = useState({
    employeeName: "",
    designation: "",
    department: "",
    salary: "",
  });

  useEffect(() => {
    if (showModal && !employeeData) {
      setEmployeeName("");
      setDesignation("");
      setDepartment("");
      setSalary("");
    }
    if (employeeData) {
      setEmployeeName(employeeData.employee_name);
      setDesignation(employeeData.designation);
      setDepartment(employeeData.department);
      setSalary(employeeData.salary);
    }
  }, [showModal,employeeData]);

  const validateForm = () => {
    let formErrors = { ...errors };
    let isValid = true;
    // Validate Employee Name
    if (employeeName.trim().length < 3) {
      formErrors.employeeName = "Employee Name must be at least 3 characters.";
      isValid = false;
    } else {
      formErrors.employeeName = "";
    }

    // Validate Designation
    if (!designation.trim()) {
      formErrors.designation = "Designation is required.";
      isValid = false;
    } else {
      formErrors.designation = "";
    }
    // Validate Department
    if (!department.trim()) {
      formErrors.department = "Department is required.";
      isValid = false;
    } else {
      formErrors.department = "";
    }
    // Validate Salary
    if (!salary || isNaN(salary) || salary <= 0) {
      formErrors.salary = "Salary must be a positive number.";
      isValid = false;
    } else {
      formErrors.salary = "";
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const token = localStorage.getItem("token");
    const formData = {
      employee_name: employeeName,
      designation,
      department,
      salary,
    };
    try {
      if (employeeData) {
        await axios.put(
          `http://localhost:8000/api/v1/employee/update/${employeeData._id}`,
          formData,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        alert("Employee updated successfully!");
        
        refreshData();
        setShowModal(false);
      } else {
        await axios.post(
          "http://localhost:8000/api/v1/employee/add",
          formData,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        alert("employee added succesfully!");
        refreshData();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error. Please try again.");
    }
  };

  return (
    <>
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        tabIndex="-1"
        aria-labelledby="employeeFormModal"
        aria-hidden="true"
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="employeeFormModal">
                {employeeData ? "Update Employee" : "Add New Employee"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="employeeName" className="form-label">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="employeeName"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    required
                  />
                  {errors.employeeName && (
                    <div className="text-danger">{errors.employeeName}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="designation" className="form-label">
                    Designation
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    required
                  />
                  {errors.designation && (
                    <div className="text-danger">{errors.designation}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="department" className="form-label">
                    Department
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                  {errors.department && (
                    <div className="text-danger">{errors.department}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="salary" className="form-label">
                    Salary
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    required
                  />
                  {errors.salary && (
                    <div className="text-danger">{errors.salary}</div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary">
                  {employeeData ? "Update Employee" : "Add Employee"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EmployeeForm;
