import React, { useEffect } from "react";
import Header from "./Header";
import axios from "axios";
const Dashboard = () => {
  const getData = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    const response = await axios.get("http://localhost:8000/api/v1/employee", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    console.table(response.data.employees);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Header></Header>
    </>
  );
};
export default Dashboard;
