import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/UnifiedLogin.css';

const UnifiedLogin = () => {
    const [loginType, setLoginType] = useState('login');
    const [selectedRole, setSelectedRole] = useState('EMPLOYEE');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData.username, formData.password);

        if (result.success) {
            toast.success('Login successful!');
            const role = result.role;
            if (role === 'ADMIN') {
                navigate('/admin-dash');
            } else if (role === 'HR') {
                navigate('/hr-dash');
            } else {
                navigate('/employee-dash');
            }
        } else {
            toast.error(result.error || 'Login failed');
        }

        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            setLoading(false);
            return;
        }

        const registerData = {
            username: formData.username,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            email: formData.email,
            role: selectedRole
        };

        const result = await register(registerData);

        if (result.success) {
            toast.success('Registration successful! Please login.');
            setLoginType('login');
            setFormData({ username: '', password: '', email: '', confirmPassword: '' });
        } else {
            toast.error(result.error || 'Registration failed');
        }

        setLoading(false);
    };

    return (
        <div className="unified-login-container">
            <div className="unified-login-card">
                <div className="unified-login-header">
                    <h1>EMP-Tracker</h1>
                    <p>Advanced Employee Management System</p>
                </div>

                <div className="toggle-container">
                    <button
                        className={`toggle-btn ${loginType === 'login' ? 'active' : ''}`}
                        onClick={() => setLoginType('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`toggle-btn ${loginType === 'register' ? 'active' : ''}`}
                        onClick={() => setLoginType('register')}
                    >
                        Register
                    </button>
                </div>

                {loginType === 'login' ? (
                    <form className="unified-login-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                ) : (
                    <form className="unified-login-form" onSubmit={handleRegister}>
                        <div className="form-group">
                            <label className="form-label">Select Role</label>
                            <div className="role-selection">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="EMPLOYEE"
                                        checked={selectedRole === 'EMPLOYEE'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <span className="radio-text">Employee</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="HR"
                                        checked={selectedRole === 'HR'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <span className="radio-text">HR</span>
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="ADMIN"
                                        checked={selectedRole === 'ADMIN'}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    />
                                    <span className="radio-text">Admin</span>
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UnifiedLogin;
