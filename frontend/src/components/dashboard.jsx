import React, { useEffect, useState } from "react";
import Header from "./Header";
import "../App.css";
import { getEmployees } from "../service/employeeService";
import { useNavigate } from "react-router-dom";
import EmployeeTable from "./EmployeeTable";
import ReactPaginate from "react-paginate";
import EmployeeForm from "./EmployeeForm";

const Dashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [sortField, setSortField] = useState("employee_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleLogout = () => {
    // You can now navigate to the login page in the component
    navigate("/login");
  };

  const getData = async (searchQuery = "", page = 1) => {
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery;
      if (sortField) params.sortBy = sortField;
      if (sortOrder) params.order = sortOrder;
      params.page = page;

      const response = await getEmployees(params);

      setEmployees(response.employees);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleLogout(); // Call your custom logout handler
      }
    }
  };

  useEffect(() => {
    getData(search, currentPage);
  }, [sortField, sortOrder, search, currentPage]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };
  const refreshData = () => {
    getData(search, currentPage);
  };
  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowModal(true);
  };
  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  return (
    <>
      <Header></Header>
      <div>
        <input
          type="text"
          name="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search for an employee or department..."
        />
      </div>
      <button className="btn btn-primary" onClick={handleAddEmployee}>
        Add new Employee
      </button>

      {employees.length > 0 ? (
        <>
          <EmployeeTable
            employees={employees}
            onSort={handleSort}
            refreshData={refreshData}
            onEdit={handleEditEmployee}
          />

          <div className="pagination mt-4 d-flex">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."} // This will display ellipses between page numbers
              pageCount={totalPages} // Total number of pages
              pageRangeDisplayed={2} // Display 4 pages in the middle (adjust this as needed)
              marginPagesDisplayed={1} // Always display the first and last page
              onPageChange={handlePageChange} // Function to handle page change
              containerClassName={"pagination-container"} // Style the pagination container
              activeClassName={"active-page"} // Add custom class for active page
            />
          </div>
        </>
      ) : (
        <p>No employees found.</p>
      )}
      <EmployeeForm
        showModal={showModal}
        setShowModal={setShowModal}
        employeeData={selectedEmployee}
        refreshData={refreshData}
      />
    </>
  );
};

export default Dashboard;
