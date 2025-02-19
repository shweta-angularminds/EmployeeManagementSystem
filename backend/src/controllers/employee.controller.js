import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Employee } from "../models/employee.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getEmployees = asyncHandler(async (req, res) => {
  const admin_Id = req.user._id;

  if (!admin_Id) {
    throw new ApiError(400, "Admin id is required!");
  }

  // Destructure query parameters
  const { page = 1, limit = 5, search, salary, sortBy, order } = req.query;

  // Convert limit and page to integers
  const limitNumber = parseInt(limit, 10);
  const pageNumber = parseInt(page, 10);

  // Default sorting field and order
  const sortField = sortBy || "employee_name"; // Default sort by name if not provided
  const sortOrder = order === "desc" ? -1 : 1; // Default ascending order

  // Build query object
  let query = { admin_Id: admin_Id }; // Ensure we only get employees for this admin

  // Search by employee name or department
  if (search) {
    query.$or = [
      { employee_name: { $regex: search, $options: "i" } }, // Search by name
      { department: { $regex: search, $options: "i" } }, // Search by department
    ];
  }

  // Salary filter (less than specified values)
  if (salary) {
    const salaryLimit = parseInt(salary, 10);
    if (salaryLimit) {
      query.salary = { $lt: salaryLimit };
    }
  }

  // Pagination
  const skip = (pageNumber - 1) * limitNumber;

  // Fetch employees with pagination, filtering, and sorting
  const employees = await Employee.find(query)
    .skip(skip)
    .limit(limitNumber)
    .sort({ [sortField]: sortOrder });

  // Get total count of employees for pagination info
  const totalEmployees = await Employee.countDocuments(query);

  return res.status(200).json({
    totalEmployees,
    employees,
    page: pageNumber,
    totalPages: Math.ceil(totalEmployees / limitNumber),
  });
});

const addEmployee = asyncHandler(async (req, res) => {
  const admin_Id = req.user._id;
  if (!admin_Id) {
    throw new ApiError(400, "admin id are required!");
  }
  const { employee_name, designation, salary, department } = req.body;
  if (!employee_name || !designation || !salary || !department) {
    throw new ApiError(400, "All fields are required!");
  }
  const employee = await Employee.create({
    employee_name: employee_name.toLowerCase(),
    designation,
    salary,
    department,
    admin_Id,
  });
  if (!employee) {
    throw new ApiError(500, "Error to add employee!");
  }
  const createdEmployee = await Employee.findById(employee._id).select(
    "-admin_Id"
  );
  if (!createdEmployee) {
    throw new ApiError(500, "employee not created!");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(200, createdEmployee, "employee added successfully!")
    );
});

const updateEmployee = asyncHandler(async (req, res) => {
  const { emp_Id } = req.params;
  if (!emp_Id) {
    throw new ApiError(404, "employee id is required");
  }
  const { employee_name, designation, salary, department } = req.body;
  if (!employee_name || !designation || !salary || !department) {
    throw new ApiError(400, "All fields are required!");
  }
  const updatedEmployee = await Employee.findByIdAndUpdate(
    emp_Id, // Employee ID to match
    { employee_name, designation, salary, department }, // Data to update
    { new: true, runValidators: true } // Options: 'new' returns the updated document, 'runValidators' ensures validation is applied
  );

  if (!updatedEmployee) {
    throw new ApiError(404, "Employee not found!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedEmployee, "employee updated successfully!")
    );
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const { emp_Id } = req.params;
  if (!emp_Id) {
    throw new ApiError(404, "employee id is required");
  }
  const response = await Employee.findByIdAndDelete(emp_Id);
  if (!response) {
    throw new ApiError(404, "Employee not exist");
  }
  return res.status(200).json({ message: "Employee Deleted succesfully!" });
});
export { addEmployee, deleteEmployee, getEmployees, updateEmployee };
