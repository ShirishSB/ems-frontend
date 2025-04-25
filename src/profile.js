import axios from "axios";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const roles = localStorage.getItem("roles");
  const getrole = roles.replace(/[/[{}\]"]/g, ''); 

  // Function to decode JWT and get username
  const getUser = () => {
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.username || decodedToken.sub; 
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const username = getUser();

      if (!username) {
        console.error("No username found in token");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://ems-app-latest.onrender.com/api/user/username/${username}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (err) {
        console.error("Error while fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser(); 

  }, [token]);
  
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ backgroundColor: "skyblue", minHeight: "100vh", padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", width: "300px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>User Profile</h2>
        {user ? (
          <div style={{ fontWeight: "bold", fontSize: "16px", lineHeight: "1.6" }}>
            <div><strong>ID:</strong> {user.id}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Age:</strong> {user.age}</div>
            <div><strong>Gender:</strong> {user.gender}</div>
            <div><strong>Username:</strong> {user.username}</div>
            <div><strong>User Role:&nbsp;</strong>{getrole}</div>
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>User not found</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
