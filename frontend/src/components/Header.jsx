import React, { useEffect, useState,useRef } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { showToast } from "../service/notify";
import { logOutUser, getProfile } from "../service/authService";

const Header = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ username: "", email: "" });
  const logoutInProgress = useRef(false); // Use ref to track logout progress

  const fetchProfileData = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      showToast("Error to load profile", "error");
      logOut();
    }
  };
  useEffect(() => {
    if (!logoutInProgress.current) {
      fetchProfileData();
      console.log("Use effect called")
    }
  }, []);

  const logOut = async () => {
    try {
      logoutInProgress.current = true;
      await logOutUser();

      showToast("Log out succesfully!", "success");
      navigate("/login");
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      logoutInProgress.current = false; 
    }
  };

  return (
    <>
      <div className="container-fluid m-0 bg-white shadow-sm">
        <nav className="d-flex justify-content-between">
          <h3 className="mt-2">WorkWise</h3>
          <span className="p-2 me-3">
            <div className="dropdown-center">
              <button
                className="btn  dropdown-toggle fw-bold"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {profile.username}
              </button>
              <ul className="dropdown-menu bg-white">
                <li onClick={logOut} className="text-center">
                  <i className="fa-solid fa-right-from-bracket"></i> logout
                </li>
              </ul>
            </div>
          </span>
        </nav>
      </div>
    </>
  );
};
export default Header;
