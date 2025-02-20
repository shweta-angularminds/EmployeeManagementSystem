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
  const [limit,setLimit]=useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleLogout = () => {
    navigate("/login");
  };

  const getData = async (searchQuery = "", page = 1,limit = 10) => {
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery;
      if (sortField) params.sortBy = sortField;
      if (sortOrder) params.order = sortOrder;
      params.page = page;
      params.limit = limit;
      const response = await getEmployees(params);
      setEmployees(response.employees);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    getData(search, currentPage,limit);
  }, [sortField, sortOrder, search, currentPage,limit]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };
  const handleLimitChange = (e) =>{
    const value = e.target.value;
    setLimit(Number(value))
  }

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };
  const refreshData = () => {
    getData(search, currentPage,limit);
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
      <div className="d-flex justify-content-between align-items-center flex-wrap p-3 bg-custom">
        <div className="col col-lg-9 col-md-9 col-8 p-2">
          <input
            type="text"
            name="search"
            value={search}
            className="input-text"
            onChange={handleSearchChange}
            placeholder="Search for an employee or department..."
          />
        </div>
        <div className="col col-lg-2 col-md-2 col-4 text-center">
          <button className="normal-btn" onClick={handleAddEmployee}>
            Add new Employee
          </button>
        </div>
      </div>

      {employees.length > 0 ? (
        <div className="bg-primary">
          <EmployeeTable
            employees={employees}
            onSort={handleSort}
            refreshData={refreshData}
            onEdit={handleEditEmployee}
          />

          <div className="pagination d-flex align-items-center mt-0 py-3 bg-custom">
            <div className="dropdown bg-custom me-4 ms-3">
              <label className="me-2">Data per page</label>
              <select onChange={handleLimitChange} value={limit}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
            </div>
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
        </div>
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
