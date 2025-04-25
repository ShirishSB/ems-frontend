
import React, { useState,useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import logout from "./components/logout";
import "./Dashboard.css";
import "./Pagination.css";


const ManagerDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const[currentPage,setCurrentPage] = useState(1);
  const[rowsPerPage] = useState(5);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );
  const total = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  
  useEffect(() => {
    setCurrentPage(1); // Reset page when search changes
  }, [search]);

useEffect(() => { 
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }
    fetch("https://ems-app-latest.onrender.com/api/employee/getAll",{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Attach JWT token
      },
  })
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, [token]);



  return (
   <div style={{ padding: "20px" }}>
      <nav className="navbar">
              <h3 className="heading">MANAGER DASHBOARD</h3>
              <div className="nav-links">
                <a href="/user/profile" style={{textDecoration:"none",fontWeight:"bolder"}}>Profile</a>
                <a href="/employee/register" style={{textDecoration:"none",fontWeight:"bolder"}}>Register</a>
                <button
          onClick={logout} 
          style={{fontWeight:"bolder", cursor: "pointer", textDecoration: "none", padding: "8px 16px", backgroundColor: "#d32f2f", color: "white", borderRadius: "4px", display: "inline-block" }}
          >Logout</button>
              </div>
            </nav>
      <TextField
        label="Search Employee..."
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>AGE</TableCell>
                <TableCell>GENDER</TableCell>
                <TableCell>DEPARTMENT</TableCell>
                <TableCell>ROLE</TableCell>
                <TableCell>EMAIL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems
                .map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>{emp.id}</TableCell>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.age}</TableCell>
                    <TableCell>{emp.gender}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>{emp.role}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  <div className="pagination">
  <button 
    disabled={currentPage === 1} 
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Prev
  </button>

  {Array.from({ length: totalPages }, (_, index) => (
    <button 
      key={index} 
      onClick={() => setCurrentPage(index + 1)}
      style={{ fontWeight: currentPage === index + 1 ? "bold" : "normal" }}
    >
      {index + 1}
    </button>
  ))}

  <button 
    disabled={currentPage >= totalPages} 
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>
    </div>
    </div>
  );
};

export default ManagerDashboard;
