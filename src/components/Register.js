import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../images/back-to-home.png";
import "./Register.css";

const Register = () => {
    const [user, setUser] = useState({ email: "", password: "" ,age:"",gender:"",userType:""});
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8081/api/user/register", user);
            setMessage(response.data.message);
            setTimeout(() => navigate("/login"), 2000); // Redirect to login after success
        } catch (error) {
            setMessage("Registration failed: " + error.response.data.message);
        }
    }; 

    return (
        <div>
            <button onClick={()=>navigate("/")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <img src={logo} alt="back to home" style={{ cursor: "pointer", width: 50, height: 50 }}/>
            </button>
            <form className="register-form" style={{background:'linear-gradient(135deg, #667eea, #764ba2)'}} onSubmit={handleSubmit}>  
            <h2 style={{fontWeight:'bolder', color:'black'}} className="user-register">Sign Up</h2>
                <input type="email" name="email" placeholder="username@mail.com" onChange={handleChange} required />
                <input type="password" name="password" placeholder="password" onChange={handleChange} required />
                <input type="text" name="age" placeholder="age" onChange={handleChange} required />
            <select name="gender" onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">M</option>
                <option value="Female">F</option>
                <option value="Other">Other</option>
                </select>
            <select name="userType" onChange={handleChange}>
                <option value="">Select Role</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="EMPLOYEE">Employee</option>
            </select>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}> 
                    <button  style={{backgroundColor:'Green', fontWeight:'bolder'}} type="submit">Sign Up</button>
                </div>
            </form>
        </div>
    );
};

export default Register;
