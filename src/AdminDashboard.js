
import React, { useState,useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import logout from "./components/logout";
import "./Dashboard.css";


const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [editEmployee, setEditEmployee] = useState(null);
  const token = localStorage.getItem("token");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSubDepartment, setSelectedSubDepartment] = useState("");



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


const departments = {
    "HR": ["Recruitment", "Payroll & Compensation", "Employee Relations"],
    "Finance & Accounting": ["Accounts Payable", "Budgeting & Forecasting", "Tax & Compliance"],
    "IT": ["Software Development", "Cybersecurity", "Help Desk & Support"],
    "Marketing": ["Digital Marketing", "Brand Management", "Market Research"],
    "Sales": ["Lead Generation", "Account Management", "Inside Sales"],
    "Customer Support": ["Technical Support", "Complaint Resolution", "Billing Support"]
};
 
useEffect(() => {
    if (editEmployee) {
      setSelectedDepartment(editEmployee.department || "");
      setSelectedSubDepartment(editEmployee.role || "");
    }
}, [editEmployee]);

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
  const handleDelete = async (id) => {
    if(!token){
      alert("Authentication error: No token found!");
      return;
    }

    try {
        const response = await axios.delete(`https://ems-app-latest.onrender.com/api/employee/delete/${id}`,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Attach JWT token
          },
        });
        if (response.status === 200) {
            setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== id));
            alert("Employee deleted successfully!");
        } else {
            alert("Failed to delete employee.");
        }
    } catch (error) {
        console.error("Error deleting employee:", error.response?.data || error.message);
        alert("Error: " + (error.response?.data || error.message));
    }
};
const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
    setSelectedSubDepartment(""); // Reset sub-department when changing department
    setEditEmployee({ ...editEmployee, department, role: "" }); // Update employee object
};
    
      // Handle Sub-Department Selection
const handleSubDepartmentChange = (e) => {
    const subDepartment = e.target.value;
    setSelectedSubDepartment(subDepartment);
    setEditEmployee({ ...editEmployee, role: subDepartment }); // Update employee object
};


const handleEdit = (employee) => {
  setEditEmployee(employee);
  setSelectedDepartment(employee.department || "");
  setSelectedSubDepartment(employee.role || "");
};

const handleEditChange = (e) => {
  const { name, value } = e.target;
  setEditEmployee({ ...editEmployee, [name]: value });
};

const handleEditSave = async () => {
  try {
    const response = await fetch(`https://ems-app-latest.onrender.com/api/employee/update/${editEmployee.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(editEmployee), // Send updated employee data
    });

    if (!response.ok) {
      throw new Error("Failed to update employee");
    }

    const updatedEmployee = await response.json();

    setEmployees(
      employees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    setEditEmployee(null);
  } catch (error) {
    console.error("Error updating employee:", error);
  }
};


  return (
   <div style={{ padding: "20px" }}>
      <nav className="navbar">
        <h3 className="heading">EMPLOYEE MANAGEMENT DASHBOARD</h3>
        <div className="nav-links">
          <a href="/user/profile" style={{textDecoration:"none",fontWeight:"bolder"}}>Profile</a>
          <a href="/users" style={{textDecoration:"none",fontWeight:"bolder"}}>Users</a>
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
                <TableCell>Actions</TableCell>
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
                    <TableCell>
                      {(
                        <>
                        <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(emp)}
                      style={{ marginRight: "5px" }}
                       >
                      <Edit fontSize="small" />
                        </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(emp.id)}
                          >
                            <Delete fontSize="small" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Employee Modal */}
    <Dialog open={!!editEmployee} onClose={() => setEditEmployee(null)}>
      <DialogTitle>Edit Employee</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={editEmployee?.name || ""}
          onChange={handleEditChange}
        />
        <TextField
          label="Age"
          name="age"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={editEmployee?.age || ""}
          onChange={handleEditChange}
        />
        <TextField
        select
          label="Gender"
          name="gender"
          variant="outlined"
          fullWidth
          margin="normal"
          value={editEmployee?.gender || ""}
          onChange={handleEditChange}
        >
        <MenuItem value="M">M</MenuItem>
  <MenuItem value="F">F</MenuItem>
  <MenuItem value="Other">OTHER</MenuItem>
  </TextField>

<TextField
            select
            label="Department"
            name="department"
            variant="outlined"
            fullWidth
            margin="normal"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
          >
            {Object.keys(departments).map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Role"
            name="role"
            variant="outlined"
            fullWidth
            margin="normal"
            value={selectedSubDepartment}
            onChange={handleSubDepartmentChange}
            disabled={!selectedDepartment}
          >
            {selectedDepartment &&
              departments[selectedDepartment]?.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
          </TextField>



        <TextField
          label="Email"
          name="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={editEmployee?.email || ""}
          onChange={handleEditChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditEmployee(null)}>Cancel</Button>
        <Button onClick={handleEditSave} variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>


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

export default AdminDashboard;
