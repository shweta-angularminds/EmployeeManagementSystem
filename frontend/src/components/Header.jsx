import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { showToast } from "../service/notify";
import { logOutUser, getProfile } from "../service/authService";

const Header = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    organization: "",
  });
  const [isLoggedOut, setIsLoggedOut] = useState(false); 

  const fetchProfileData = async () => {
    try {
      const data = await getProfile();
      console.log(data);
      setProfile(data);
    } catch (error) {
      showToast("Error loading profile", "error");
    }
  };

  useEffect(() => {
    
    if (isLoggedOut === false) {
      fetchProfileData();
    }
    console.log("Use effect called");
  }, [isLoggedOut]); 

  const logOut = async () => {
    try {
      await logOutUser();

      showToast("Logged out successfully!", "success");
      setIsLoggedOut(true);
      navigate("/login");
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      console.log("Logout process finished");
    }
  };

  return (
    <>
      <div className="container-fluid m-0 bg-white shadow-sm">
        <nav className="d-flex justify-content-between">
          <h3 className="mt-2 text-capitalize">{profile.organization}</h3>
          <span className="p-2 me-3">
            <div className="dropdown-center">
              <button
                className="btn dropdown-toggle fw-bold"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <label  className="text-capitalize"> {profile.username}</label>
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
