import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        config.headers["Authorization"] = `Bearer ${localStorage.getItem(
          "token"
        )}`;
        return axiosInstance(error.config);
      }
    }
    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    logoutUser();
    return false;
  }
  try {
    const response = await axios.post(
      "http://localhost:8000/api/v1/auth/refresh-token",
      {},
      {
        withCredentials: true,
      }
    );
    console.log(response.data);

    const newAccessToken = response.data.token;
    if (newAccessToken) {
      localStorage.setItem("token", newAccessToken);
      console.log("New access token generated:", newAccessToken);
      return true;
    }
  } catch (error) {
    console.error("Failed to refresh access token: ", error);
    logoutUser();
    return false;
  }
};
const logoutUser = () => {
  localStorage.removeItem("token");
};

export default axiosInstance;
