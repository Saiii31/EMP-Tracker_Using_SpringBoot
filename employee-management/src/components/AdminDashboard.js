import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Welcome Admin</h2>
      <div className="dashboard-links">
        <Link to="/list">Manage Employees</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
