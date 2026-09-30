import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import '../styles/Global.css';

function EmployeeForm() {
    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        phone: "",
        employeeId: "",
        department: "",
        designation: "",
        salary: "",
        joinDate: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        managerId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchEmployee();
        }
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`http://localhost:8081/api/employees/${id}`, config);
            setEmployee(response.data);
        } catch (error) {
            toast.error("Failed to fetch employee details");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            if (id) {
                await axios.put(`http://localhost:8081/api/employees/${id}`, employee, config);
                toast.success("Employee updated successfully");
            } else {
                await axios.post('http://localhost:8081/api/employees', employee, config);
                toast.success("Employee created successfully");
            }
            navigate("/list");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save employee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem'
        }}>
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <h1 style={{ margin: 0, color: '#1f2937' }}>
                        {id ? "Edit Employee" : "Add New Employee"}
                    </h1>
                    <button
                        onClick={() => navigate("/list")}
                        className="btn btn-secondary"
                    >
                        <FiArrowLeft style={{ marginRight: '8px' }} />
                        Back
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={employee.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Employee ID *</label>
                            <input
                                type="text"
                                name="employeeId"
                                className="form-control"
                                value={employee.employeeId}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email *</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={employee.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone *</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-control"
                                value={employee.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Department</label>
                            <input
                                type="text"
                                name="department"
                                className="form-control"
                                value={employee.department}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Designation</label>
                            <input
                                type="text"
                                name="designation"
                                className="form-control"
                                value={employee.designation}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Salary</label>
                            <input
                                type="number"
                                name="salary"
                                className="form-control"
                                value={employee.salary}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Join Date</label>
                            <input
                                type="date"
                                name="joinDate"
                                className="form-control"
                                value={employee.joinDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">City</label>
                            <input
                                type="text"
                                name="city"
                                className="form-control"
                                value={employee.city}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">State</label>
                            <input
                                type="text"
                                name="state"
                                className="form-control"
                                value={employee.state}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                className="form-control"
                                value={employee.postalCode}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Manager ID</label>
                            <input
                                type="number"
                                name="managerId"
                                className="form-control"
                                value={employee.managerId}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Address</label>
                        <textarea
                            name="address"
                            className="form-control"
                            value={employee.address}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={() => navigate("/list")}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            <FiSave style={{ marginRight: '8px' }} />
                            {loading ? 'Saving...' : (id ? 'Update Employee' : 'Create Employee')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EmployeeForm;
