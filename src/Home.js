import React from "react";
import "./Home.css"; // Optional CSS for styling

const Home = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <h2 className="heading">Employee and User Management System</h2>
        <div className="nav-links">
          <a href="/login" style={{textDecoration:"none",fontWeight:"bolder"}}>Login</a>
          <a href="/user/register" style={{textDecoration:"none",fontWeight:"bolder"}}>Sign Up</a>
          <a href="/admin/dashboard" style={{textDecoration:"none",fontWeight:"bolder"}}>Dashboard</a>
        </div>
      </nav>
      <div className="home-content"></div>
    </div>
  );
};

export default Home;
