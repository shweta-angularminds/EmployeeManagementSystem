import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { registerUser } from "../service/authService.js";
import { showToast } from "../service/notify";


const RegisterForm = () => {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData.username) validationErrors.username = "Username is required!";
    if (!formData.email) validationErrors.email = "email is required!";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      validationErrors.email = "Please enter a valid email.";
    if (formData.password.length < 6)
      validationErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      validationErrors.confirmPassword = "Password not match!";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const { confirmPassword, ...dataToSend } = formData;
        await registerUser(dataToSend);
        setErrors({});
        showToast("Registered Succesfully!", "success");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        showToast("Unable to register, Please try again!", "error");
        console.error("Registration failed:", error);
        setErrors({
          api: "An error occurred while registering. Please try again.",
        });
      }
    }
  };

  return (
    <>
      <div
        className="container-fluid vh-100 mt-0 m-0 p-2 back-color
      "
      >
        <div className="row d-flex justify-content-center align-items-center">
          <div
            className="col col-lg-4 bg-white mt-5 p-4 
           border"
          >
            <div className="header text-center">
              <h3 className="green-gradient">Register</h3>
            </div>
            <div className="w-100 ">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    placeholder="username"
                    className="input-text"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {errors.username && (
                    <p className="error">{errors.username}</p>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    placeholder="email"
                    className="input-text"
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div className="mb-3">
                  <input
                    placeholder="password"
                    className="input-text"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <p className="error">{errors.password}</p>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    className="input-text"
                    type="password"
                    placeholder="confirm password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <p className="error">{errors.confirmPassword}</p>
                  )}
                </div>
                <div className="text-center mt-2 p-2">
                  <button className="submit-btn" type="submit">
                    Create Account
                  </button>
                </div>
                <div className="navigation">
                  <p>Already have an account? </p>
                  <Link to="/login" className="anchor">
                    Login here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default RegisterForm;
