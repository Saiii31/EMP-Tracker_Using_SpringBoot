import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import '../styles/employeeList.css';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get('http://localhost:8081/api/employees', config);
            setEmployees(response.data);
        } catch (error) {
            toast.error("Failed to fetch employees. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.delete(`http://localhost:8081/api/employees/${id}`, config);
            setEmployees(employees.filter(emp => emp.id !== id));
            toast.success("Employee deleted successfully.");
        } catch (error) {
            toast.error("Failed to delete employee.");
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="employee-list-container">
            <div className="employee-list-header">
                <h1>Employee Management</h1>
                <div className="actions">
                    <button onClick={() => navigate("/add")} className="btn btn-primary">
                        <FiPlus style={{ marginRight: '8px' }} />
                        Add Employee
                    </button>
                </div>
            </div>

            <div className="employee-table-card">
                <div className="search-bar">
                    <div style={{ position: 'relative', flex: 1 }}>
                        <FiSearch style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#9ca3af'
                        }} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search employees by name, email, or employee ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '3rem' }}
                        />
                    </div>
                </div>

                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Employee ID</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No employees found
                                </td>
                            </tr>
                        ) : (
                            filteredEmployees.map((emp) => (
                                <tr key={emp.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className="employee-avatar">
                                                {emp.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#1f2937' }}>
                                                    {emp.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{emp.employeeId}</td>
                                    <td>{emp.department || '-'}</td>
                                    <td>{emp.designation || '-'}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.phone}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => navigate(`/edit/${emp.id}`)}
                                                className="btn-action btn-edit"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(emp.id)}
                                                className="btn-action btn-delete"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EmployeeList;
