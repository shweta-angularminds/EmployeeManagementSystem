import React from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showToast } from "../service/notify";
const Header = () => {
  const navigate = useNavigate();
  const logOut = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/logout",
        "",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      console.log("Logout :", response);
      localStorage.clear("token");
      showToast("Log out succesfully!", "success");
      navigate("/login");
    } catch (error) {
      showToast("Something went wrong", "error");
      console.error("logout failed:", error);
    }
  };

  return (
    <>
      <div className="container-fluid m-0 bg-white shadow-sm">
        <nav className="d-flex justify-content-between">
          <h3 className="mt-2">WorkWise</h3>
          <span className="p-2">
            <button className="btn btn-primary" onClick={logOut}>
              logout
            </button>
          </span>
        </nav>
      </div>
    </>
  );
};
export default Header;
