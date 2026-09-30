import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiBriefcase, FiCheckCircle, FiClock, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../styles/ProfessionalDashboard.css';

const MyTasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const fetchMyTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8081/api/tasks/my-tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'IN_PROGRESS': return 'primary';
            case 'PENDING': return 'warning';
            default: return 'secondary';
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
                    <h1>My Tasks</h1>
                    <p>View and manage your assigned tasks</p>
                </div>
                <button onClick={fetchMyTasks} className="btn btn-secondary">
                    <FiRefreshCw style={{ marginRight: '8px' }} />
                    Refresh
                </button>
            </div>

            <div className="dashboard-section">
                {tasks.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        border: '2px dashed #e0e0e0'
                    }}>
                        <FiBriefcase size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                        <p style={{ color: '#6b7280', margin: 0 }}>No tasks assigned to you yet</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {tasks.map(task => (
                            <div
                                key={task.id}
                                style={{
                                    padding: '1.5rem',
                                    background: 'white',
                                    borderRadius: '12px',
                                    borderLeft: `4px solid ${
                                        task.status === 'COMPLETED' ? '#10b981' :
                                        task.status === 'IN_PROGRESS' ? '#667eea' :
                                        '#f59e0b'
                                    }`,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
                                            {task.title}
                                        </h3>
                                        <p style={{ margin: '0 0 1rem 0', color: '#6b7280', lineHeight: '1.6' }}>
                                            {task.description}
                                        </p>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <span className={`status-badge ${getStatusColor(task.status)}`}>
                                                {task.status}
                                            </span>
                                            {task.dueDate && (
                                                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                                    <FiClock style={{ marginRight: '5px' }} />
                                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            )}
                                            {task.priority && (
                                                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                                    Priority: {task.priority}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTasks;
