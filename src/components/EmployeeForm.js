import React, { useState } from "react";
import axios from "axios";
import "./EmployeeForm.css"
import {useNavigate} from "react-router-dom";

const EmployeeForm = () => {
    const [employee, setEmployee] = useState({ name: "", email: "", department: "",gender:"",age:"",role:""});
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedSubDepartment, setSelectedSubDepartment] = useState("");
    const navigate = useNavigate();

        const retrievedRoles = JSON.parse(localStorage.getItem("roles"));
        console.log(retrievedRoles);
        const isadmin = retrievedRoles.filter((role)=>role==='ROLE_ADMIN');
        const ismanager = retrievedRoles.filter((role)=> role==='ROLE_MANAGER');

    const departments = {
        "HR": ["Recruitment", "Payroll & Compensation", "Employee Relations"],
        "Finance & Accounting": ["Accounts Payable", "Budgeting & Forecasting", "Tax & Compliance"],
        "IT": ["Software Development", "Cybersecurity", "Help Desk & Support"],
        "Marketing": ["Digital Marketing", "Brand Management", "Market Research"],
        "Sales": ["Lead Generation", "Account Management", "Inside Sales"],
        "Customer Support": ["Technical Support", "Complaint Resolution", "Billing Support"]
      };

      const handleDepartmentChange = (e) => {
        const department = e.target.value;
        setSelectedDepartment(department);
        setSelectedSubDepartment(""); // Reset sub-department when changing department
        setEmployee({ ...employee, department, role: "" }); // Update employee object
      };
    
      // Handle Sub-Department Selection
      const handleSubDepartmentChange = (e) => {
        const subDepartment = e.target.value;
        setSelectedSubDepartment(subDepartment);
        setEmployee({ ...employee, role: subDepartment }); // Update employee object
      };



    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };
    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://ems-app-latest.onrender.com/api/employee/create", employee,{
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            });
            alert("Employee Registered Successfully");
            if(isadmin[0]==="ROLE_ADMIN"){
              setTimeout(() => navigate("/admin/dashboard"), 1000);
            }
            else if(ismanager[0]==="ROLE_MANAGER"){
              setTimeout(() => navigate("/manager/dashboard"), 1000);
            }
            else{
              setTimeout(() => navigate("/employee/dashboard"), 1000);
            }
        } catch (error) {
            alert("employee already exist with email or network error");
            console.error("Error registering employee", error);
        }
    };

    return (<div>
        <form className="forms-body" onSubmit={handleSubmit}>
            <h2 className="form-title" style={{color:'black',fontWeight:'bolder'}}>Employee Registration</h2>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="text" name="age" placeholder="Age" onChange={handleChange} required />
            <select name="gender" value={employee.gender}onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">M</option>
                <option value="Female">F</option>
                <option value="Other">OTHER</option>
                </select>
            {/* Department Selection */}
        <select value={selectedDepartment} onChange={handleDepartmentChange} required>
          <option value="">Select Department</option>
          {Object.keys(departments).map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>

        {/* Sub-Department Selection */}
        <select
          value={selectedSubDepartment}
          onChange={handleSubDepartmentChange}
          required
          disabled={!selectedDepartment} // Disable if no department is selected
        >
          <option value="">Select Sub-Department</option>
          {selectedDepartment &&
            departments[selectedDepartment].map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
        </select>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <button style={{backgroundColor:'green'}} type="submit">Submit</button>
        </div>
        </form>
        </div>
    );
};

export default EmployeeForm;
