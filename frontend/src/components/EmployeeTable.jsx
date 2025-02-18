import React, { useState } from "react";
import axios from "axios";
const EmployeeTable = ({ employees, onSort,refreshData ,onEdit}) => {
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    onSort(field, order);
  };

  const deleteEmployee = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        "http://localhost:8000/api/v1/employee/delete/" + id,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
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
                <button className="btn btn-primary" onClick={() =>onEdit(employee)}>Update</button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteEmployee(employee._id)}
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
