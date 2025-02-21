import axiosInstance from "../api/axiosInstance";

const deleteEmployee = async (id) => {
  try {
    await axiosInstance.delete(`/employee/delete/${id}`);
  } catch (error) {
    throw error;
  }
};
const addEmployee = async (formData) => {
  try {
    await axiosInstance.post("/employee/add", formData);
  } catch (error) {
    throw error;
  }
};
const updateEmployee = async (id, formData) => {
  try {
    await axiosInstance.put(`/employee/update/${id}`, formData);
  } catch (error) {
    throw error;
  }
};
const getEmployees = async (params) => {
  try {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   throw new Error("No token found");
    // }
    const response = await axiosInstance.get("/employee", {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export { deleteEmployee, addEmployee, updateEmployee, getEmployees };
