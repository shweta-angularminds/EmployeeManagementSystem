import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./components/login";
import RegisterForm from "./components/register";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/dashboard";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<RegisterForm />}></Route>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<Login />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
