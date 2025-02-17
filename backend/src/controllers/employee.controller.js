import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Employee } from "../models/employee.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addEmployee = asyncHandler(async (req, res) => {
  const { employee_name, designation, salary, department } = req.body;
  if (
    [employee_name, designation, salary, department].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!");
  }
  const employee = await Employee.create({
    employee_name: employee_name.toLowerCase(),
    designation,
    salary,
    department,
  });
  if (!employee) {
    throw new ApiError(500, "Error to register user!");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, employee, "employee added successfully!"));
});
