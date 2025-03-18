import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import AdminLogin from "./components/AdminLogin";
import EmployeeLogin from "./components/EmployeeLogin";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeForm from "./components/EmployeeForm";  // Import Employee Form Component
import EmployeeList from "./components/EmployeeList";
import { ToastContainer } from "react-toastify";  // Toast container for global notifications
import "react-toastify/dist/ReactToastify.css";  // Importing Toastify CSS globally

function App() {
    return (
        <Router>
            <div>
                {/* Global Toast Notifications */}
                <ToastContainer 
                    position="top-right" 
                    autoClose={3000} 
                    hideProgressBar={false} 
                    newestOnTop={false} 
                    closeOnClick 
                    rtl={false} 
                    pauseOnFocusLoss 
                    draggable 
                    pauseOnHover 
                />
                
                {/* Application Routes */}
                <Routes>
                    {/* Home Route - Employee List Page */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/employee-login" element={<EmployeeLogin />} />
                    <Route path="/admin-dash" element={<AdminDashboard />} />                     
                    <Route path="/list" element={<EmployeeList />} />
                  
                    
                    {/* Add Employee Route - Form to add new employee */}
                    <Route path="/add" element={<EmployeeForm />} />
                    
                    {/* Edit Employee Route - Form to edit existing employee details */}
                    <Route path="/edit/:id" element={<EmployeeForm />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
