import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const goToAdminLogin = () => {
    navigate("/admin-login"); // Navigate to the Admin Login page
  };

  const goToEmployeeLogin = () => {
    navigate("/employee-login"); // Navigate to the Employee Login page
  };

  return (
    <div className="homepage-container"> {/* Use the CSS class here */}
      <h1>Welcome to the Login Portal</h1>
      <p>Please choose your login type</p>
      <div className="button-container">
        <button onClick={goToAdminLogin}>Admin Login</button>
        <button onClick={goToEmployeeLogin}>Employee Login</button>
      </div>
    </div>
  );
};

export default HomePage;
