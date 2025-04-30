import React from "react";
import "./Home.css"; // Optional CSS for styling

const Home = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <h2 className="heading">Employee and User Management System</h2>
        <div className="nav-links">
          <a id="home-login" href="/login" style={{textDecoration:"none",fontWeight:"bolder"}}>Login</a>
          <a id="home-user-reg-link" href="/user/register" style={{textDecoration:"none",fontWeight:"bolder"}}>Sign Up</a>
          <a id="admin-dash" href="/admin/dashboard" style={{textDecoration:"none",fontWeight:"bolder"}}>Dashboard</a>
        </div>
      </nav>
      <div className="home-content"></div>
    </div>
  );
};

export default Home;
