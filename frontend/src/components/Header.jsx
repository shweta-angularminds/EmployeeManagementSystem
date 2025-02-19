import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { showToast } from "../service/notify";
import { logOutUser } from "../service/authService";

const Header = () => {
  const navigate = useNavigate();
  const logOut = async () => {

    try {

      await logOutUser();

      showToast("Log out succesfully!", "success");
      navigate("/login");

    } catch (error) {
      showToast("Something went wrong", "error");
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
