import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { showToast } from "../service/notify";
import { loginUser } from "../service/authService";

const Login = () => {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    if (!formData.email) validationErrors.email = "Email is required!";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      validationErrors.email = "Please enter a valid email.";
    if (!formData.password) validationErrors.password = "Password is required!";
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        await loginUser(formData);
        showToast("Login successful!", "success");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);

        setErrors({});
      } catch (error) {
        showToast("Login Failed!", "error");
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
              <h3 className="green-gradient">Login</h3>
            </div>
            <div className="w-100 py-3">
              <form onSubmit={handleSubmit}>
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

                <div className="text-center mt-2 p-2">
                  <button className="submit-btn" type="submit">
                    Login
                  </button>
                </div>
                <div className="navigation mt-0">
                  <p>New user? </p>
                  <Link to="/register" className="anchor">
                    Register here
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
export default Login;
