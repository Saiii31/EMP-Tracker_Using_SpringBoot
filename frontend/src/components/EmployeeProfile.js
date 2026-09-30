import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiUser, FiMail, FiBriefcase, FiEdit2, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../styles/ProfessionalDashboard.css';

const EmployeeProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8081/api/employees/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);
        } catch (error) {
            toast.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8081/api/employees/${profile.id}`, profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Profile updated successfully');
            setEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>My Profile</h1>
                    <p>View and update your personal information</p>
                </div>
                {!editing && (
                    <button onClick={() => setEditing(true)} className="btn btn-secondary">
                        <FiEdit2 style={{ marginRight: '8px' }} />
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="dashboard-section">
                {profile ? (
                    <form onSubmit={handleUpdate}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '2rem'
                        }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                                    <FiUser style={{ marginRight: '8px' }} />
                                    Name
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={profile.name || ''}
                                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            fontSize: '1rem'
                                        }}
                                    />
                                ) : (
                                    <p style={{ fontSize: '1.1rem', color: '#333' }}>{profile.name || 'N/A'}</p>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                                    <FiMail style={{ marginRight: '8px' }} />
                                    Email
                                </label>
                                <p style={{ fontSize: '1.1rem', color: '#333' }}>{user?.email || 'N/A'}</p>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                                    <FiBriefcase style={{ marginRight: '8px' }} />
                                    Department
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={profile.department || ''}
                                        onChange={(e) => setProfile({...profile, department: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            fontSize: '1rem'
                                        }}
                                    />
                                ) : (
                                    <p style={{ fontSize: '1.1rem', color: '#333' }}>{profile.department || 'N/A'}</p>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                                    Designation
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={profile.designation || ''}
                                        onChange={(e) => setProfile({...profile, designation: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            fontSize: '1rem'
                                        }}
                                    />
                                ) : (
                                    <p style={{ fontSize: '1.1rem', color: '#333' }}>{profile.designation || 'N/A'}</p>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                                    Phone
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={profile.phone || ''}
                                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            fontSize: '1rem'
                                        }}
                                    />
                                ) : (
                                    <p style={{ fontSize: '1.1rem', color: '#333' }}>{profile.phone || 'N/A'}</p>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                                    Employee ID
                                </label>
                                <p style={{ fontSize: '1.1rem', color: '#333' }}>{profile.employeeId || 'N/A'}</p>
                            </div>
                        </div>

                        {editing && (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-secondary">
                                    <FiSave style={{ marginRight: '8px' }} />
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="btn"
                                    style={{ background: '#e0e0e0', color: '#333' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        border: '2px dashed #e0e0e0'
                    }}>
                        <FiUser size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                        <p style={{ color: '#6b7280', margin: 0 }}>Profile not found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeProfile;
