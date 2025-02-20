import React, { useState, useEffect } from "react";
import { addEmployee, updateEmployee } from "../service/employeeService";
import { showToast } from "../service/notify";
import "../App.css";
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
  }, [showModal, employeeData]);

  const validateForm = () => {
    let formErrors = { ...errors };
    let isValid = true;

    if (employeeName.trim().length < 3) {
      formErrors.employeeName = "Employee Name must be at least 3 characters.";
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(employeeName.trim())) {
      formErrors.employeeName =
        "Employee Name can only contain letters and spaces.";
      isValid = false;
    } else {
      formErrors.employeeName = "";
    }


    if (designation.trim().length < 2) {
      formErrors.designation = "Designation name must be at least 2 characters";
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(designation.trim())) {
      formErrors.designation =
        "Designation can only contain letters and spaces.";
      isValid = false;
    } else {
      formErrors.designation = "";
    }

    if (department.trim().length < 2) {
      formErrors.department = "Department name must be at least 2 characters";
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(department.trim())) {
      formErrors.department = "Department can only contain letters and spaces.";
      isValid = false;
    } else {
      formErrors.department = "";
    }

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

    const formData = {
      employee_name: employeeName,
      designation,
      department,
      salary,
    };
    try {
      if (employeeData) {
        await updateEmployee(employeeData._id, formData);
        showToast("Updated successfully!", "success");
      } else {
        await addEmployee(formData);
        showToast("Added successfully!", "success");
      }
      refreshData();
      setShowModal(false);
    } catch (error) {
      showToast("There was an error. Please try again.", "error");
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
                onClick={() => {
                  setShowModal(false);
                  setErrors({});
                }}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="employeeName" className="form-label fw-bold">
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
                  <label htmlFor="designation" className="form-label fw-bold">
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
                  <label htmlFor="department" className="form-label fw-bold">
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
                  <label htmlFor="salary" className="form-label fw-bold">
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
                <div className="p-2 text-end">
                  <button type="submit" className="btn normal-btn">
                    {employeeData ? "Update Employee" : "Add Employee"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EmployeeForm;
