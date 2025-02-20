import axios from "axios";
import axiosInstance from "../api/axiosInstance";

const registerUser = async (data) => {
  try {
    await axiosInstance.post("/auth/register", data);
  } catch (error) {
    throw error;
  }
};

const loginUser = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/login", data, {
      withCredentials: true,
    });
    localStorage.setItem("token", response.data.data.accessToken);
  } catch (error) {
    throw error;
  }
};

const logOutUser = async () => {
  try {
    await axiosInstance.post(
      "/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );

    localStorage.removeItem("token");
  } catch (error) {
    throw error;
  }
};

const getProfile = async () => {
  try {
    const response = await axiosInstance.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export { registerUser, loginUser, logOutUser, getProfile };
