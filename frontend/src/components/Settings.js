import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiSettings, FiUser, FiBell, FiLock, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../styles/ProfessionalDashboard.css';

const Settings = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        darkMode: false,
        language: 'en'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulate saving settings
        setTimeout(() => {
            localStorage.setItem('userSettings', JSON.stringify(settings));
            toast.success('Settings saved successfully');
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>Settings</h1>
                    <p>Manage your account preferences</p>
                </div>
            </div>

            <div className="dashboard-section">
                <form onSubmit={handleSave}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>
                        <FiUser style={{ marginRight: '8px' }} />
                        Account Settings
                    </h3>
                    
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="emailNotifications"
                                    checked={settings.emailNotifications}
                                    onChange={handleChange}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span style={{ fontSize: '1rem', color: '#333' }}>Email Notifications</span>
                            </label>
                            <p style={{ marginLeft: '28px', fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                                Receive email notifications for important updates
                            </p>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="pushNotifications"
                                    checked={settings.pushNotifications}
                                    onChange={handleChange}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span style={{ fontSize: '1rem', color: '#333' }}>Push Notifications</span>
                            </label>
                            <p style={{ marginLeft: '28px', fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                                Receive push notifications in your browser
                            </p>
                        </div>
                    </div>

                    <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>
                        <FiBell style={{ marginRight: '8px' }} />
                        Notification Preferences
                    </h3>

                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                                Language
                            </label>
                            <select
                                name="language"
                                value={settings.language}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    maxWidth: '300px',
                                    padding: '12px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                            </select>
                        </div>
                    </div>

                    <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>
                        <FiLock style={{ marginRight: '8px' }} />
                        Security
                    </h3>

                    <div style={{ marginBottom: '2rem' }}>
                        <p style={{ color: '#666', marginBottom: '1rem' }}>
                            To change your password, please contact your administrator.
                        </p>
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

export default Settings;
