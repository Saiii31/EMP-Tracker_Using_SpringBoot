import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const EmployeeDashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Welcome Employee</h2>
      <div className="dashboard-links">
        <Link to="/profile">Update</Link>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
