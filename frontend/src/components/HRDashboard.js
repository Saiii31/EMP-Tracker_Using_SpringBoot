import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiUsers, FiBriefcase, FiCalendar, FiCheckCircle, FiLogOut, FiTrendingUp, FiAlertCircle, FiClock, FiSettings, FiUserPlus, FiFileText, FiBarChart2, FiBell } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../styles/ProfessionalDashboard.css';

const HRDashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        activeTasks: 0,
        pendingLeaves: 0,
        presentToday: 0,
        onLeaveToday: 0,
        newJoinersThisMonth: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [employeesRes, tasksRes, leavesRes] = await Promise.all([
                axios.get('http://localhost:8081/api/employees', { headers }),
                axios.get('http://localhost:8081/api/tasks', { headers }),
                axios.get('http://localhost:8081/api/leave-requests/pending', { headers })
            ]);

            const employees = employeesRes.data || [];
            const tasks = tasksRes.data || [];
            const leaves = leavesRes.data || [];

            setStats({
                totalEmployees: employees.length,
                activeTasks: tasks.filter(t => t.status !== 'COMPLETED').length,
                pendingLeaves: leaves.length,
                presentToday: Math.floor(employees.length * 0.85),
                onLeaveToday: Math.floor(employees.length * 0.05),
                newJoinersThisMonth: 3
            });

            // Mock recent activities
            setRecentActivities([
                { id: 1, type: 'leave', message: 'John Doe requested leave', time: '2 hours ago', status: 'pending' },
                { id: 2, type: 'task', message: 'New task assigned to Engineering team', time: '4 hours ago', status: 'completed' },
                { id: 3, type: 'employee', message: 'New employee Jane Smith joined', time: '1 day ago', status: 'info' },
                { id: 4, type: 'attendance', message: 'Monthly attendance report generated', time: '2 days ago', status: 'success' }
            ]);

            setNotifications([
                { id: 1, message: '3 leave requests pending approval', time: '1 hour ago', type: 'alert' },
                { id: 2, message: 'New employee onboarding completed', time: '3 hours ago', type: 'success' },
                { id: 3, message: 'Monthly HR report is ready', time: '1 day ago', type: 'info' }
            ]);
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Logged out successfully');
    };

    const handleNavigation = (path) => {
        navigate(path);
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
                            HR
                        </div>
                        <div>
                            <h1>HR Dashboard</h1>
                            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                                Welcome, {user?.username || 'HR Manager'}
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
                    <div className="icon employees">
                        <FiUsers />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalEmployees}</h3>
                        <p>Total Employees</p>
                        <div className="trend up">↑ 12% from last month</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="icon tasks">
                        <FiBriefcase />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.activeTasks}</h3>
                        <p>Active Tasks</p>
                        <div className="trend up">↑ 8% from last week</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="icon leaves">
                        <FiCalendar />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.pendingLeaves}</h3>
                        <p>Pending Leaves</p>
                        <div className="trend">Awaiting action</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="icon attendance">
                        <FiClock />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.presentToday}</h3>
                        <p>Present Today</p>
                        <div className="trend">Today's attendance</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="icon completed">
                        <FiCheckCircle />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.newJoinersThisMonth}</h3>
                        <p>New Joiners</p>
                        <div className="trend">This month</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="dashboard-section">
                    <h2>Quick Actions</h2>
                    <div className="dashboard-links">
                        <div className="dashboard-link" onClick={() => handleNavigation('/employees')} style={{ cursor: 'pointer' }}>
                            <FiUsers />
                            <div>
                                <span>Manage Employees</span>
                                <small>View and manage employee profiles</small>
                            </div>
                        </div>
                        <div className="dashboard-link" onClick={() => handleNavigation('/tasks')} style={{ cursor: 'pointer' }}>
                            <FiBriefcase />
                            <div>
                                <span>Task Management</span>
                                <small>Assign and track tasks</small>
                            </div>
                        </div>
                        <div className="dashboard-link" onClick={() => handleNavigation('/leave-requests')} style={{ cursor: 'pointer' }}>
                            <FiCalendar />
                            <div>
                                <span>Leave Requests</span>
                                <small>Review and approve leaves</small>
                            </div>
                        </div>
                        <div className="dashboard-link" onClick={() => handleNavigation('/attendance')} style={{ cursor: 'pointer' }}>
                            <FiBarChart2 />
                            <div>
                                <span>Attendance Reports</span>
                                <small>View attendance analytics</small>
                            </div>
                        </div>
                        <div className="dashboard-link" onClick={() => handleNavigation('/add-employee')} style={{ cursor: 'pointer' }}>
                            <FiUserPlus />
                            <div>
                                <span>Add New Employee</span>
                                <small>Onboard new team members</small>
                            </div>
                        </div>
                        <div className="dashboard-link" onClick={() => handleNavigation('/reports')} style={{ cursor: 'pointer' }}>
                            <FiFileText />
                            <div>
                                <span>Generate Reports</span>
                                <small>Create HR reports</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-section">
                    <h2>Recent Activities</h2>
                    {recentActivities.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            background: '#f9fafb',
                            borderRadius: '10px',
                            border: '2px dashed #e0e0e0'
                        }}>
                            <FiTrendingUp size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                            <p style={{ color: '#6b7280', margin: 0 }}>No recent activities</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {recentActivities.map(activity => (
                                <div
                                    key={activity.id}
                                    style={{
                                        padding: '1rem',
                                        background: '#f9fafb',
                                        borderRadius: '10px',
                                        borderLeft: `4px solid ${
                                            activity.status === 'pending' ? '#f59e0b' :
                                            activity.status === 'success' ? '#10b981' :
                                            activity.status === 'completed' ? '#667eea' :
                                            '#6b7280'
                                        }`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        background: activity.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' :
                                                    activity.status === 'success' ? 'rgba(16, 185, 129, 0.1)' :
                                                    activity.status === 'completed' ? 'rgba(102, 126, 234, 0.1)' :
                                                    'rgba(107, 114, 128, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: activity.status === 'pending' ? '#f59e0b' :
                                               activity.status === 'success' ? '#10b981' :
                                               activity.status === 'completed' ? '#667eea' :
                                               '#6b7280'
                                    }}>
                                        {activity.type === 'leave' && <FiCalendar />}
                                        {activity.type === 'task' && <FiBriefcase />}
                                        {activity.type === 'employee' && <FiUserPlus />}
                                        {activity.type === 'attendance' && <FiClock />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: '0 0 4px 0', color: '#333', fontSize: '0.95rem' }}>
                                            {activity.message}
                                        </p>
                                        <span style={{ fontSize: '0.8rem', color: '#999' }}>{activity.time}</span>
                                    </div>
                                    {activity.status === 'pending' && (
                                        <span className="status-badge warning">Action Required</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HRDashboard;
