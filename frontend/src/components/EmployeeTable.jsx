import React, { useState } from "react";
import { confirmDelete } from "../service/notify";
import axiosInstance from "../api/axiosInstance";
const EmployeeTable = ({ employees, onSort, refreshData, onEdit }) => {
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    onSort(field, order);
  };
  const handleDeleteClick = (employeeId) => {
    // Show the confirmation dialog when the user clicks delete
    confirmDelete().subscribe((confirmed) => {
      if (confirmed) {
        // Call deleteEmployee if the user confirmed the deletion
        deleteEmployee(employeeId)
          .then(() => {
            console.log("Employee deleted successfully!");
            // Optionally, update your state to remove the employee from the UI
            // For example, you can filter out the deleted employee
          })
          .catch((error) => {
            console.error("Error deleting employee:", error);
            // You could also show an error toast here
          });
      } else {
        console.log("Employee deletion cancelled");
      }
    });
  };

  const deleteEmployee = async (id) => {
    try {
      const response = await axiosInstance.delete(`/employee/delete/${id}`);
      console.log("response:", response);
      alert("employee deleted succesfully !");
      refreshData();
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("An error occurred while deleting the employee.");
    }
  };

  return (
    <>
      <table class="table border mt-4">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col d-flex">
              <span className="d-flex align-items-center">
                <span className="me-2">Employee Name</span>
                <span className="d-flex flex-column align-items-center justify-content-start">
                  <i
                    className="fa-solid fa-caret-up m-0 p-0"
                    onClick={() => handleSort("employee_name", "asc")}
                  ></i>
                  <i
                    className="fa-solid fa-caret-down m-0 p-0"
                    onClick={() => handleSort("employee_name", "desc")}
                  ></i>
                </span>
              </span>
            </th>
            <th scope="col">Designation</th>
            <th scope="col">Department</th>
            <th scope="col">
              {" "}
              <span className="d-flex align-items-center">
                <span className="me-2">Salary</span>
                <span className="d-flex flex-column align-items-center justify-content-start">
                  <i
                    className="fa-solid fa-caret-up m-0 p-0"
                    onClick={() => handleSort("salary", "asc")}
                  ></i>
                  <i
                    className="fa-solid fa-caret-down m-0 p-0"
                    onClick={() => handleSort("salary", "desc")}
                  ></i>
                </span>
              </span>
            </th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee._id}>
              <td>{index + 1}</td> {/* This will display the row number */}
              <td>{employee.employee_name}</td>
              <td>{employee.designation}</td>
              <td>{employee.department}</td>
              <td>${employee.salary}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => onEdit(employee)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteClick(employee._id)}
                >
                  delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default EmployeeTable;
