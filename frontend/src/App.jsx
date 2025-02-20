import "./App.css";
import Login from "./components/login";
import RegisterForm from "./components/register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/dashboard";
import PrivateRoute from "./api/PrivateRoute";
function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token ? true : false;
  };

  return (
    <div>
      <Router>
        <Routes>
          {/* <Route path="/" element={<RegisterForm />}></Route> */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={
              isAuthenticated() ? (
                <Navigate to="/dashboard" />
              ) : (
                <RegisterForm />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />
            }
          />
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          {/* <Route path="/dashboard" element={<Dashboard />}></Route> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
