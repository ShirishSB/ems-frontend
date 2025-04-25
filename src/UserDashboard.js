
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
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import logo from "./images/back-to-home.png";
import "./AdminDashboard.css";

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();


    const[currentPage,setCurrentPage] = useState(1);
    const[rowsPerPage] = useState(5);
  
    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
    );
    const total = filteredUsers.length;
    const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    
    useEffect(() => {
      setCurrentPage(1); // Reset page when search changes
    }, [search]);

  useEffect(() => { 
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }
    fetch("https://ems-app-latest.onrender.com/api/user/all",{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Attach JWT token
      },
  })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, [token,reloadTrigger]);
  const handleDelete = async (id) => {
    if(!token){
      alert("Authentication error: No token found!");
      return;
    }

    try {
        const response = await axios.delete(`https://ems-app-latest.onrender.com/api/user/${id}`,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Attach JWT token
          },
        });
        if (response.status === 200) {
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            alert("User deleted successfully!");
        } else {
            alert("Failed to delete User.");
        }
    } catch (error) {
        console.error("Error deleting user:", error.response?.data || error.message);
        alert("Error: " + (error.response?.data || error.message));
    }
};


//Handle Edit 

const handleEdit = (user) => {
  setEditUser({...user,password:null,});
};
const handleEditChange = (e) => {
  const { name, value } = e.target;
  console.log(`Field changed: ${name}, New Value: ${value}`); // Debugging

  setEditUser((prevUser) => ({
    ...prevUser,
    [name]: value===""?null:value, // Ensure role updates correctly
  }));
};


const handleEditSave = async () => {
  if (!editUser || !editUser.id) {
    alert("Error: No user selected for editing.");
    return;
  }

  const payload = {
    ...editUser,
    password: editUser.password ? editUser.password : null, 
    gender: editUser.gender? editUser.gender:null,
  };

  console.log("Saving user:", payload); // Debugging

  try {
    const response = await axios.put(
      `https://ems-app-latest.onrender.com/api/user/${editUser.id}`,
      editUser,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update state
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === response.data.id ? response.data : user))
    );
    setReloadTrigger((prev)=>!prev);

    setEditUser(null);
    alert("User updated successfully!");
  } catch (error) {
    console.error("Error updating user:", error.response?.data || error.message);
    alert("Failed to update user.");
  }
};



  return (
   <div className="admin-page" style={{ padding: "20px" }}>
      <div className="header">
      <button onClick={()=>navigate("/admin/dashboard")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <img src={logo} alt="back to home" style={{ cursor: "pointer", width: 50, height: 50 }}/>
    </button>
      <h2>USER MANAGEMENT DASHBOARD</h2>
      </div>
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
                <TableCell>EMAIL</TableCell>
                <TableCell>PASSWORD</TableCell>
                <TableCell>AGE</TableCell>
                <TableCell>GENDER</TableCell>
                <TableCell>ROLES</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.password}</TableCell>
                    <TableCell>{user.age}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>
  {user.roles.length > 0 ? user.roles.map((role, index) => index < 2 && role.roleName).filter(Boolean).join(", ") : "No roles"}
</TableCell>
                    <TableCell>
                      {(
                        <>
                        <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(user)}
                      style={{ marginRight: "5px" }}
                       >
                      <Edit fontSize="small" />
                        </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(user.id)}
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

      {/* Edit User Modal */}
    <Dialog open={Boolean(editUser)} onClose={() => setEditUser(null)}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          label="Email"
          name="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={editUser?.email || ""}
          onChange={handleEditChange}
        />
        <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "2px", color:"red",}}>
        Enter the password only if you want to change it. Otherwise, your old password remains.
</div>
        <TextField
          label="Password"
          name="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={editUser?.password || ""}
          onChange={handleEditChange}
        />
        <TextField
          label="Age"
          name="age"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={editUser?.age || ""}
          onChange={handleEditChange}
        />
        <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "2px", color:"red",}}>
        Select the gender only if you want to change it. Otherwise, your old choice remains.
</div>
        <TextField
        select
          label="Gender"
          name="gender"
          variant="outlined"
          fullWidth
          margin="normal"
          value={editUser?.gender || ""}
          onChange={handleEditChange}
          defaultValue=""
        >
  <MenuItem value="Male">M</MenuItem>
  <MenuItem value="Female">F</MenuItem>
  <MenuItem value="OTHER">OTHER</MenuItem>
  </TextField>

  <TextField
        select
          label="UserType"
          name="userType"
          variant="outlined"
          fullWidth
          margin="normal"
          value={editUser?.userType || ""}
          onChange={handleEditChange}
        >
        <MenuItem value="ADMIN">ADMIN</MenuItem>
  <MenuItem value="MANAGER">MANAGER</MenuItem>
  <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
  </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditUser(null)}>Cancel</Button>
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

export default UserDashboard;
