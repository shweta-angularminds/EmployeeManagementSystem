import { Router } from "express";
import {
  addEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../controllers/employee.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/").get(verifyJWT, getEmployees);
router.route("/add").post(verifyJWT, addEmployee);
router.route("/delete/:emp_Id").delete(verifyJWT, deleteEmployee);
router.route("/update/:emp_Id").put(verifyJWT, updateEmployee);
export default router;
