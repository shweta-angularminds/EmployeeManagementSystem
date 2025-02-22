import React, { useState } from "react";
import { confirmDelete, showToast } from "../service/notify";
import { deleteEmployee } from "../service/employeeService";
import { firstValueFrom } from "rxjs";
import "../App.css";
const EmployeeTable = ({ employees, onSort, refreshData, onEdit }) => {
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    onSort(field, order);
  };

  const handleDeleteClick = async (employeeId) => {
    try {
      const confirmed = await firstValueFrom(confirmDelete());

      if (confirmed) {
        await deleteEmployee(employeeId);
        showToast("Deleted successfully!", "success");
        refreshData();
      }
    } catch (error) {
      showToast("Something went wrong!", "error");
    }
  };

  return (
    <>
      <table className="table table-responsive table-hover border mb-0">
        <thead className="">
          <tr className="">
            <th scope="col ">#</th>
            <th scope="col  " className="d-flex ">
              <span className="d-flex align-items-center ">
                <span className="me-2 ">Employee Name</span>
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
            <th scope="col">Email</th>
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
              <td>{index + 1}</td>
              <td>{employee.employee_name}</td>
              <td >{employee.designation}</td>
              <td>{employee.department}</td>
              <td style={{ textTransform: "lowercase" }}>{employee.email}</td>
              <td>
                &#8377;
                {employee.salary}
              </td>
              <td className="text-start">
                <button
                  className="update-btn me-2 mb-1"
                  onClick={() => onEdit(employee)}
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button
                  className="delete-btn me-2"
                  onClick={() => handleDeleteClick(employee._id)}
                >
                  <i className="fa-solid fa-trash"></i>
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
