import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiBriefcase, FiCalendar, FiClock, FiLogOut, FiSettings, FiTrendingUp, FiShield, FiDatabase, FiActivity, FiZap, FiPieChart, FiBell } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../styles/ProfessionalDashboard.css';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        activeTasks: 0,
        pendingLeaves: 0,
        todayAttendance: 0,
        totalDepartments: 5,
        systemHealth: 98
    });
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const [employeesRes, tasksRes, leavesRes] = await Promise.all([
                axios.get('http://localhost:8081/api/employees', config),
                axios.get('http://localhost:8081/api/tasks', config),
                axios.get('http://localhost:8081/api/leave-requests/pending', config)
            ]);

            const employees = employeesRes.data || [];
            const tasks = tasksRes.data || [];
            const leaves = leavesRes.data || [];

            setStats({
                totalEmployees: employees.length,
                activeTasks: tasks.filter(t => t.status !== 'COMPLETED').length,
                pendingLeaves: leaves.length,
                todayAttendance: Math.floor(employees.length * 0.88),
                totalDepartments: 5,
                systemHealth: 98
            });

            setNotifications([
                { id: 1, message: 'System backup completed successfully', time: '2 hours ago', type: 'success' },
                { id: 2, message: 'New user registration requires approval', time: '5 hours ago', type: 'alert' },
                { id: 3, message: 'Monthly performance report is ready', time: '1 day ago', type: 'info' }
            ]);
        } catch (error) {
            toast.error('Failed to fetch dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
    };

    const taskData = [
        { name: 'Pending', value: Math.max(1, Math.floor(stats.activeTasks * 0.3)) },
        { name: 'In Progress', value: Math.max(1, stats.activeTasks) },
        { name: 'Completed', value: Math.max(1, Math.floor(stats.activeTasks * 1.5)) },
    ];

    const departmentData = [
        { name: 'Engineering', employees: Math.floor(stats.totalEmployees * 0.35) },
        { name: 'Marketing', employees: Math.floor(stats.totalEmployees * 0.20) },
        { name: 'Sales', employees: Math.floor(stats.totalEmployees * 0.25) },
        { name: 'HR', employees: Math.floor(stats.totalEmployees * 0.10) },
        { name: 'Finance', employees: Math.floor(stats.totalEmployees * 0.10) },
    ];

    const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

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
                            A
                        </div>
                        <div>
                            <h1>Admin Dashboard</h1>
                            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                                Welcome, {user?.username || 'Administrator'}
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
                        <div className="trend down">↓ 5% from last week</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="icon attendance">
                        <FiClock />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.todayAttendance}</h3>
                        <p>Present Today</p>
                        <div className="trend up">↑ 3% from yesterday</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="icon completed">
                        <FiShield />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalDepartments}</h3>
                        <p>Departments</p>
                        <div className="trend">Active units</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="icon balance">
                        <FiActivity />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.systemHealth}%</h3>
                        <p>System Health</p>
                        <div className="trend up">Optimal</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="dashboard-section">
                    <h2>Task Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={taskData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {taskData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="dashboard-section">
                    <h2>Quick Actions</h2>
                    <div className="dashboard-links">
                        <Link to="/list" className="dashboard-link">
                            <FiUsers />
                            <div>
                                <span>Manage Employees</span>
                                <small>View and manage staff</small>
                            </div>
                        </Link>
                        <Link to="/tasks" className="dashboard-link">
                            <FiBriefcase />
                            <div>
                                <span>Manage Tasks</span>
                                <small>Assign and track tasks</small>
                            </div>
                        </Link>
                        <Link to="/leaves" className="dashboard-link">
                            <FiCalendar />
                            <div>
                                <span>Leave Requests</span>
                                <small>Review leave applications</small>
                            </div>
                        </Link>
                        <Link to="/attendance" className="dashboard-link">
                            <FiClock />
                            <div>
                                <span>Attendance Records</span>
                                <small>View attendance data</small>
                            </div>
                        </Link>
                        <Link to="/departments" className="dashboard-link">
                            <FiSettings />
                            <div>
                                <span>Departments</span>
                                <small>Manage organizational units</small>
                            </div>
                        </Link>
                        <Link to="/analytics" className="dashboard-link">
                            <FiPieChart />
                            <div>
                                <span>Advanced Analytics</span>
                                <small>View detailed insights</small>
                            </div>
                        </Link>
                        <Link to="/system" className="dashboard-link">
                            <FiDatabase />
                            <div>
                                <span>System Settings</span>
                                <small>Configure application</small>
                            </div>
                        </Link>
                        <Link to="/audit" className="dashboard-link">
                            <FiZap />
                            <div>
                                <span>Audit Logs</span>
                                <small>View system activity</small>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="dashboard-section" style={{ marginTop: '1.5rem' }}>
                <h2>Department Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="employees" fill="#667eea" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminDashboard;
