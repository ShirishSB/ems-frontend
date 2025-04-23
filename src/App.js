import EmployeeForm from "./components/EmployeeForm";
import Register from "./components/Register";
import Login from "./components/Login";
import { BrowserRouter as Router, Route, Routes,useLocation} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "./Home";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import Profile from "../src/profile";
import "./App.css";
import ManagerDashboard from "./ManagerDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
function App() {
  return (
    <Router>
      <ConditionalWrapper>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
        <Route path="/user/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={< UserDashboard/>}/>
          <Route path="/manager/dashboard" element={< ManagerDashboard/>}/>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />}></Route>
          <Route path="/employee/register" element={<EmployeeForm />} />
          <Route path="/user/profile" element={<Profile />}></Route>
        </Route>
    </Routes>
    </ConditionalWrapper>
</Router>
  )
}
    // Filename - App.js
  function ConditionalWrapper({ children }) {
    const location = useLocation();
  
    // Define routes where background should be applied
    const routesWithBackground = ["/home"];
  
    // Check if the current route is in the list
    const shouldApplyBackground = routesWithBackground.includes(location.pathname);
  
    return (
      <div className={shouldApplyBackground ? "background-image" : ""}>
        {children}
      </div>
    );
}

export default App;
