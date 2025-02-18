import React, { useEffect, useState } from "react";
import Header from "./Header";
import "../App.css";
import axios from "axios";
import EmployeeTable from "./EmployeeTable";
import ReactPaginate from "react-paginate";
const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [sortField, setSortField] = useState("employee_name"); // Default to sorting by employee_name
  const [sortOrder, setSortOrder] = useState("asc"); // Default to ascending order
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch data based on search, sort field, and sort order
  const getData = async (searchQuery = "", page = 1) => {
    const token = localStorage.getItem("token");
    console.log("page number provided in get data:", page);

    // Prepare the query parameters conditionally
    const params = {};
    if (searchQuery) params.search = searchQuery; // Only add search if it exists
    if (sortField) params.sortBy = sortField; // Only add sortBy if it's defined
    if (sortOrder) params.order = sortOrder; // Only add order if it's defined
    params.page = page;

    const response = await axios.get("http://localhost:8000/api/v1/employee", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      params, // Passing the query parameters
    });

    console.log("api response:", response);
    console.table(response.data.employees);
    setEmployees(response.data.employees);
    setTotalPages(response.data.totalPages);
    setCurrentPage(response.data.page); // Ensure the correct page number is set after API call
  };

  useEffect(() => {
    getData(search, currentPage); // Fetch data when currentPage or search changes
  }, [sortField, sortOrder, search, currentPage]); // This will trigger when any of these change

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value); // This will trigger useEffect to re-fetch the data
  };

  const handleSort = (field, order) => {
    setSortField(field); // Set the sort field
    setSortOrder(order); // Set the sort order
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1); // react-paginate uses a 0-based index
  };
  const refreshData = () =>{
    getData(search,currentPage);
  }

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
      <EmployeeTable employees={employees} onSort={handleSort} refreshData={refreshData}/>
      {/* Pagination Controls */}
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
  );
};

export default Dashboard;
