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
    organization:"",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const validateForm = (formData) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

    let validationErrors = {};

    if (!formData.username) validationErrors.username = "Username is required!";
    if (!formData.email) validationErrors.email = "Email is required!";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      validationErrors.email = "Please enter a valid email.";

    if (!formData.organization)
      validationErrors.organization = "Organization is required!";
    if (!passwordRegex.test(formData.password)) {
      validationErrors.password =
        "Password must be at least 6 characters long and contain at least one alphabet and one digit.";
    }

    if (formData.password !== formData.confirmPassword)
      validationErrors.confirmPassword = "Password does not match!";

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    validationErrors = await validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      console.log("data:", dataToSend);
      await registerUser(dataToSend);

      setErrors({});
      showToast("Registered Succesfully!", "success");
      setFormData({
        username: "",
        email: "",
        organization: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      showToast("Unable to register, Please try again!", "error");
      console.log("Registration failed:", error);
      setErrors({
        api: "An error occurred while registering. Please try again.",
      });
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
            className="col col-lg-4 col-md-8 col-10 bg-white mt-5 p-4 
           border "
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
                    placeholder="organization name"
                    className="input-text"
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                  />
                  {errors.organization && (
                    <p className="error">{errors.organization}</p>
                  )}
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
