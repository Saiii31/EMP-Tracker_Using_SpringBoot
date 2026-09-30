import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiUser, FiBriefcase, FiCalendar, FiClock, FiLogOut, FiCheckCircle, FiXCircle, FiBell, FiSettings, FiTrendingUp, FiAward } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../styles/ProfessionalDashboard.css';

const EmployeeDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        myTasks: 0,
        pendingLeaves: 0,
        thisMonthAttendance: 0,
        completedTasks: 0,
        leaveBalance: 15
    });
    const [recentTasks, setRecentTasks] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const [tasksRes, leavesRes] = await Promise.all([
                axios.get('http://localhost:8081/api/tasks/my-tasks', config),
                axios.get('http://localhost:8081/api/leave-requests/my-requests', config)
            ]);

            const tasks = tasksRes.data || [];
            const leaves = leavesRes.data || [];

            setStats({
                myTasks: tasks.filter(t => t.status !== 'COMPLETED').length,
                pendingLeaves: leaves.filter(l => l.status === 'PENDING').length,
                thisMonthAttendance: 22,
                completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
                leaveBalance: 15
            });

            setRecentTasks(tasks.slice(0, 5));

            // Mock notifications
            setNotifications([
                { id: 1, message: 'New task assigned: "Project Review"', time: '2 hours ago', type: 'task' },
                { id: 2, message: 'Your leave request has been approved', time: '1 day ago', type: 'success' },
                { id: 3, message: 'Performance review scheduled for next week', time: '2 days ago', type: 'info' }
            ]);
        } catch (error) {
            toast.error('Failed to fetch employee data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
    };

    const getTaskStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return '#10b981';
            case 'IN_PROGRESS': return '#667eea';
            case 'PENDING': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    const getTaskStatusBadge = (status) => {
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }}>
                            {user?.username?.charAt(0).toUpperCase() || 'E'}
                        </div>
                        <div>
                            <h1>Welcome, {user?.username || 'Employee'}!</h1>
                            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                                {user?.email || 'employee@company.com'}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                style={{
                                    padding: '10px',
                                    background: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    position: 'relative'
                                }}
                            >
                                <FiBell size={20} style={{ color: '#667eea' }} />
                                {notifications.length > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-5px',
                                        right: '-5px',
                                        background: '#ef4444',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        fontSize: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                            {showNotifications && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '10px',
                                    background: 'white',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    width: '300px',
                                    zIndex: 1000,
                                    maxHeight: '400px',
                                    overflowY: 'auto'
                                }}>
                                    <div style={{ padding: '15px', borderBottom: '1px solid #e0e0e0' }}>
                                        <h3 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>Notifications</h3>
                                    </div>
                                    {notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            style={{
                                                padding: '12px 15px',
                                                borderBottom: '1px solid #f0f0f0',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                        >
                                            <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#333' }}>
                                                {notification.message}
                                            </p>
                                            <span style={{ fontSize: '0.75rem', color: '#999' }}>{notification.time}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={handleLogout} className="btn btn-secondary">
                            <FiLogOut style={{ marginRight: '8px' }} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="icon tasks">
                        <FiBriefcase />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.myTasks}</h3>
                        <p>Active Tasks</p>
                        <div className="trend">↑ 12% from last week</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="icon leaves">
                        <FiCalendar />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.pendingLeaves}</h3>
                        <p>Pending Leaves</p>
                        <div className="trend">Awaiting approval</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="icon attendance">
                        <FiClock />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.thisMonthAttendance}</h3>
                        <p>Days Present</p>
                        <div className="trend">This month</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="icon completed">
                        <FiCheckCircle />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.completedTasks}</h3>
                        <p>Completed Tasks</p>
                        <div className="trend">↑ 8% from last month</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="icon balance">
                        <FiAward />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.leaveBalance}</h3>
                        <p>Leave Balance</p>
                        <div className="trend">Days remaining</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="dashboard-section">
                    <h2>Recent Tasks</h2>
                    {recentTasks.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            background: '#f9fafb',
                            borderRadius: '10px',
                            border: '2px dashed #e0e0e0'
                        }}>
                            <FiBriefcase size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                            <p style={{ color: '#6b7280', margin: 0 }}>No tasks assigned yet</p>
                            <Link to="/my-tasks" style={{
                                display: 'inline-block',
                                marginTop: '1rem',
                                color: '#667eea',
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}>
                                View all tasks →
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {recentTasks.map(task => (
                                <div
                                    key={task.id}
                                    style={{
                                        padding: '1.25rem',
                                        background: 'white',
                                        borderRadius: '12px',
                                        borderLeft: `4px solid ${getTaskStatusColor(task.status)}`,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateX(5px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937', fontSize: '1.1rem' }}>
                                                {task.title}
                                            </h4>
                                            <p style={{ margin: '0 0 0.75rem 0', color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                                {task.description}
                                            </p>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <span className={`status-badge ${getTaskStatusBadge(task.status)}`}>
                                                    {task.status}
                                                </span>
                                                {task.dueDate && (
                                                    <span style={{ fontSize: '0.85rem', color: '#999' }}>
                                                        Due: {new Date(task.dueDate).toLocaleDateString()}
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

                <div className="dashboard-section">
                    <h2>Quick Actions</h2>
                    <div className="dashboard-links">
                        <Link to="/my-tasks" className="dashboard-link">
                            <FiBriefcase />
                            <div>
                                <span>View My Tasks</span>
                                <small>Manage your assignments</small>
                            </div>
                        </Link>
                        <Link to="/request-leave" className="dashboard-link">
                            <FiCalendar />
                            <div>
                                <span>Request Leave</span>
                                <small>Apply for time off</small>
                            </div>
                        </Link>
                        <Link to="/my-attendance" className="dashboard-link">
                            <FiClock />
                            <div>
                                <span>My Attendance</span>
                                <small>View attendance records</small>
                            </div>
                        </Link>
                        <Link to="/profile" className="dashboard-link">
                            <FiUser />
                            <div>
                                <span>My Profile</span>
                                <small>Update personal info</small>
                            </div>
                        </Link>
                        <Link to="/notifications" className="dashboard-link">
                            <FiBell />
                            <div>
                                <span>Notifications</span>
                                <small>View all alerts</small>
                            </div>
                        </Link>
                        <Link to="/settings" className="dashboard-link">
                            <FiSettings />
                            <div>
                                <span>Settings</span>
                                <small>Account preferences</small>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
