import axiosInstance from "../api/axiosInstance";

const registerUser = async (data) => {
  try {
    await axiosInstance.post("/auth/register", data);
  } catch (error) {
    throw error;
  }
};
export { registerUser };
