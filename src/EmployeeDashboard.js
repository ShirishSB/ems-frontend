import React, { useEffect, useState } from "react";
import logout from "./components/logout";
import {jwtDecode} from "jwt-decode";
import "./AdminDashboard.css";

const EmployeeDashboard = () => {
  const[emp,setEmp] = useState([]);
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);
  const username = decodedToken.sub;


  
  useEffect(() => { 
      if (!token) {
        console.error("No token found. User is not authenticated.");
        return;
      }
      fetch(`https://ems-frontend-theta-five.vercel.app/employee/get/${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Object.keys(data).length > 0) {
            setEmp(data);
          } else {
            setEmp(null); // Set to null if empty or invalid
          }
  })
        .catch((err) => 
          {
            console.error("Error fetching employees:", err)
            setEmp(null);
  });
    }, [token]);

  
  if(!emp || Object.keys(emp).length===0){
    return (
      <div style={{ textAlign: "center", padding: "50px"}}>
        {/* Navigation Bar */}
        <nav className="navbar">
          <h2 className="heading">Employee Dashboard</h2>
          <div className="nav-links">
            <a href="/user/profile" style={{textDecoration:"none",fontWeight:"bolder"}}>Profile</a>
            <a href="/employee/register" style={{textDecoration:"none",fontWeight:"bolder"}}>Register</a>
            <button
      onClick={logout} 
      style={{fontWeight:"bolder", cursor: "pointer", textDecoration: "none", padding: "8px 16px", backgroundColor: "#d32f2f", color: "white", borderRadius: "4px", display: "inline-block" }}
      >Logout</button>
          </div>
        </nav>
        <div>
        <h2 style={{fontWeight:"bolder",color:"red"}}>Please register first using the same email as the user email.</h2>
        </div>
        </div>
    )
  }

else{
  return (
    <div className="admin-page" style={{ textAlign: "center", padding: "50px"}}>
      {/* Navigation Bar */}
      <nav className="navbar">
        <h2 className="heading">Employee Dashboard</h2>
        <div className="nav-links">
          <a href="/user/profile" style={{textDecoration:"none",fontWeight:"bolder"}}>Profile</a>
          <a href="/employee/register" style={{textDecoration:"none",fontWeight:"bolder"}}>Register</a>
          <button
    onClick={logout} 
    style={{fontWeight:"bolder", cursor: "pointer", textDecoration: "none", padding: "8px 16px", backgroundColor: "#d32f2f", color: "white", borderRadius: "4px", display: "inline-block" }}
    >Logout</button>
        </div>
      </nav>
      <div style={{backgroundColor:"#40e0d0"}}>
        <div>
          <h2 style={{backgroundColor:"black",color:"white"}}>Employee Details</h2>
          <h3><strong>ID:</strong>{emp.id}</h3>
          <h3><strong>Name:</strong>{emp.name}</h3>
          <h3><strong>Gender:</strong>{emp.gender}</h3>
          <h3><strong>Age:</strong>{emp.age}</h3>
          <h3><strong>Email:</strong>{emp.email}</h3>
          <h3><strong>Role:</strong>{emp.role}</h3>
          <h3><strong>Department:</strong>{emp.department}</h3>
        </div>
      </div>
  </div>
  );
}
};

export default EmployeeDashboard;
