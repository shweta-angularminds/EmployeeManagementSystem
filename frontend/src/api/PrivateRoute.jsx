import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, children }) => {
  const isAuth = isAuthenticated();
  return isAuth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
