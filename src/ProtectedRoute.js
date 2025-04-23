import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const roles = JSON.parse(localStorage.getItem("roles")) || [];
  const isadmin = roles.filter((role)=>role ==="ROLE_ADMIN");
  const ismanager = roles.filter((role)=>role ==="ROLE_MANAGER");
  const isemployee = roles.filter((role)=>role==="ROLE_EMPLOYEE");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    if (isadmin[0] !== "ROLE_ADMIN") {
      if(ismanager[0]!=="ROLE_MANAGER" && isemployee[0]!=="ROLE_EMPLOYEE"){
        return <Navigate to="/login" replace />;
      }
    }
    return <Outlet />;
  } catch (error) {
    console.error("Invalid token", error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
