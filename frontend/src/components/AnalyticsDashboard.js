import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { FaChartLine, FaChartBar, FaChartPie, FaClock, FaUsers, FaTasks, FaCalendarCheck } from 'react-icons/fa';
import '../styles/AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
    const [analyticsData, setAnalyticsData] = useState({
        employeeTrends: [],
        taskCompletion: [],
        leaveStatistics: [],
        departmentPerformance: [],
        attendanceTrends: []
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7d');

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeRange]);

    const fetchAnalyticsData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch data from various endpoints
            const [employeesRes, tasksRes, leavesRes, attendanceRes] = await Promise.all([
                axios.get('http://localhost:8081/api/employees', { headers }),
                axios.get('http://localhost:8081/api/tasks', { headers }),
                axios.get('http://localhost:8081/api/leave-requests', { headers }),
                axios.get('http://localhost:8081/api/attendance', { headers })
            ]);

            // Process data for charts
            const employeeTrends = generateTrendData(employeesRes.data.length, 'employees');
            const taskCompletion = generateTaskCompletionData(tasksRes.data);
            const leaveStatistics = generateLeaveStatistics(leavesRes.data);
            const departmentPerformance = generateDepartmentData(employeesRes.data);
            const attendanceTrends = generateAttendanceData(attendanceRes.data);

            setAnalyticsData({
                employeeTrends,
                taskCompletion,
                leaveStatistics,
                departmentPerformance,
                attendanceTrends
            });
        } catch (error) {
            console.error('Error fetching analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateTrendData = (baseValue, type) => {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const data = [];
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: Math.floor(baseValue * (0.8 + Math.random() * 0.4))
            });
        }
        return data;
    };

    const generateTaskCompletionData = (tasks) => {
        const statusCounts = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});

        return [
            { name: 'Completed', value: statusCounts['COMPLETED'] || 0, color: '#10b981' },
            { name: 'In Progress', value: statusCounts['IN_PROGRESS'] || 0, color: '#667eea' },
            { name: 'Pending', value: statusCounts['PENDING'] || 0, color: '#f59e0b' },
            { name: 'On Hold', value: statusCounts['ON_HOLD'] || 0, color: '#ef4444' }
        ];
    };

    const generateLeaveStatistics = (leaves) => {
        const statusCounts = leaves.reduce((acc, leave) => {
            acc[leave.status] = (acc[leave.status] || 0) + 1;
            return acc;
        }, {});

        return [
            { name: 'Approved', value: statusCounts['APPROVED'] || 0, color: '#10b981' },
            { name: 'Pending', value: statusCounts['PENDING'] || 0, color: '#f59e0b' },
            { name: 'Rejected', value: statusCounts['REJECTED'] || 0, color: '#ef4444' }
        ];
    };

    const generateDepartmentData = (employees) => {
        const deptCounts = employees.reduce((acc, emp) => {
            const dept = emp.department || 'Unassigned';
            acc[dept] = (acc[dept] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(deptCounts).map(([name, count]) => ({
            name,
            employees: count,
            tasks: Math.floor(count * (2 + Math.random() * 3))
        }));
    };

    const generateAttendanceData = (attendance) => {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const data = [];
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const present = Math.floor(attendance.length * (0.7 + Math.random() * 0.25));
            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                present,
                absent: attendance.length - present
            });
        }
        return data;
    };

    const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#f59e0b', '#ef4444'];

    if (loading) {
        return (
            <div className="analytics-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <h1>Advanced Analytics Dashboard</h1>
                <div className="time-range-selector">
                    <button
                        className={timeRange === '7d' ? 'active' : ''}
                        onClick={() => setTimeRange('7d')}
                    >
                        7 Days
                    </button>
                    <button
                        className={timeRange === '30d' ? 'active' : ''}
                        onClick={() => setTimeRange('30d')}
                    >
                        30 Days
                    </button>
                    <button
                        className={timeRange === '90d' ? 'active' : ''}
                        onClick={() => setTimeRange('90d')}
                    >
                        90 Days
                    </button>
                </div>
            </div>

            <div className="analytics-grid">
                <div className="analytics-card large">
                    <div className="card-header">
                        <h3><FaChartLine /> Employee Growth Trend</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={analyticsData.employeeTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="analytics-card">
                    <div className="card-header">
                        <h3><FaChartPie /> Task Completion</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={analyticsData.taskCompletion}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {analyticsData.taskCompletion.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="analytics-card">
                    <div className="card-header">
                        <h3><FaCalendarCheck /> Leave Statistics</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={analyticsData.leaveStatistics}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {analyticsData.leaveStatistics.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="analytics-card large">
                    <div className="card-header">
                        <h3><FaChartBar /> Department Performance</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData.departmentPerformance}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="employees" fill="#667eea" name="Employees" />
                            <Bar dataKey="tasks" fill="#764ba2" name="Tasks" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="analytics-card large">
                    <div className="card-header">
                        <h3><FaClock /> Attendance Trends</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analyticsData.attendanceTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="present" stroke="#10b981" name="Present" />
                            <Line type="monotone" dataKey="absent" stroke="#ef4444" name="Absent" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
