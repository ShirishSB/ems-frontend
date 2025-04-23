const logout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("roles");  
    window.location.href = "/login";   
};

export default logout;
