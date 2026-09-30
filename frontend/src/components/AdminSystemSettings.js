import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiSettings, FiDatabase, FiShield, FiUsers, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../styles/ProfessionalDashboard.css';

const AdminSystemSettings = () => {
    const { user } = useAuth();
    const [systemSettings, setSystemSettings] = useState({
        companyName: 'EMP-Tracker',
        maxLeaveDays: 30,
        workingHours: 9,
        allowSelfRegistration: true,
        requireApprovalForTasks: true
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSystemSettings({
            ...systemSettings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulate saving settings
        setTimeout(() => {
            localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
            toast.success('System settings saved successfully');
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('systemSettings');
        if (savedSettings) {
            setSystemSettings(JSON.parse(savedSettings));
        }
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>System Settings</h1>
                    <p>Configure application-wide settings</p>
                </div>
            </div>

            <div className="dashboard-section">
                <form onSubmit={handleSave}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>
                        <FiDatabase style={{ marginRight: '8px' }} />
                        General Settings
                    </h3>
                    
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                                Company Name
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={systemSettings.companyName}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    maxWidth: '400px',
                                    padding: '12px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                                Maximum Leave Days (per year)
                            </label>
                            <input
                                type="number"
                                name="maxLeaveDays"
                                value={systemSettings.maxLeaveDays}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    maxWidth: '200px',
                                    padding: '12px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                                Working Hours (per day)
                            </label>
                            <input
                                type="number"
                                name="workingHours"
                                value={systemSettings.workingHours}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    maxWidth: '200px',
                                    padding: '12px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>
                        <FiShield style={{ marginRight: '8px' }} />
                        Security Settings
                    </h3>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="allowSelfRegistration"
                                    checked={systemSettings.allowSelfRegistration}
                                    onChange={handleChange}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span style={{ fontSize: '1rem', color: '#333' }}>Allow Self Registration</span>
                            </label>
                            <p style={{ marginLeft: '28px', fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                                Allow new users to register without admin approval
                            </p>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="requireApprovalForTasks"
                                    checked={systemSettings.requireApprovalForTasks}
                                    onChange={handleChange}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span style={{ fontSize: '1rem', color: '#333' }}>Require Approval for Tasks</span>
                            </label>
                            <p style={{ marginLeft: '28px', fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                                Require HR/Admin approval before task assignment
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        <FiSave style={{ marginRight: '8px' }} />
                        {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSystemSettings;
