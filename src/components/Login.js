import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../images/back-to-home.png";
import "./Login.css"
const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post("http://localhost:8081/auth/login", credentials);
        console.log(response.data);
        const { token, roles} = response.data; // Extract token & roles
        localStorage.setItem("token", token);
        localStorage.setItem("roles", JSON.stringify(roles));
        const retrievedRoles = JSON.parse(localStorage.getItem("roles"));
        console.log(retrievedRoles);
        const isadmin = retrievedRoles.filter((role)=>role==='ROLE_ADMIN');
        const ismanager = retrievedRoles.filter((role)=> role==='ROLE_MANAGER');
        if(isadmin[0] ==="ROLE_ADMIN"){
            navigate("/admin/dashboard");
        }
        else if(ismanager[0]==="ROLE_MANAGER"){
            alert("navigating to manager dashboard");
            setTimeout(()=>navigate("/manager/dashboard"),1000);
        }
        else{
            alert("navigating to employee dashboard");
            setTimeout(()=>navigate("/employee/dashboard"),1000);
        }
        
        } catch (error) {
            setMessage("Invalid username or password");
            alert(message);
        }
    };

    return (
        <div>
            <button onClick={()=>navigate("/")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <img src={logo} alt="back to home" style={{ cursor: "pointer", width: 50, height: 50 }}/>
            </button>
            <form className="form-body" onSubmit={handleSubmit}>
            <h2 className="form-login">Login</h2>
                <input type="email" name="username" placeholder="username@mail.com" onChange={handleChange} required />
                <input type="password" name="password" placeholder="password" onChange={handleChange} required />
                <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <button type="submit"  style={{fontWeight:'bolder', backgroundColor:'Green', cursor: 'pointer', textDecoration: 'none'}} >Login</button>
                </div>
                <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <h4 style={{fontWeight:'bolder'}}>Don't have an account?&nbsp;</h4>
                <a href="/user/register"
 style={{ color: 'white', cursor: 'pointer',fontWeight:'bolder', textDecoration: 'none'}} 
                className="mt-4">Sign Up</a>
                </div>
                </form>

        </div>
    );
};

export default Login;
