import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiCalendar, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../styles/ProfessionalDashboard.css';

const HRAttendanceReports = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8081/api/attendance', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAttendance(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch attendance records');
        } finally {
            setLoading(false);
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
                    <h1>Attendance Reports</h1>
                    <p>View and analyze employee attendance data</p>
                </div>
                <button onClick={fetchAttendance} className="btn btn-secondary">
                    <FiRefreshCw style={{ marginRight: '8px' }} />
                    Refresh
                </button>
            </div>

            <div className="dashboard-section">
                {attendance.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        border: '2px dashed #e0e0e0'
                    }}>
                        <FiCalendar size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                        <p style={{ color: '#6b7280', margin: 0 }}>No attendance records found</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Employee</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Check In</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Check Out</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map(record => (
                                    <tr key={record.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                                        <td style={{ padding: '12px' }}>{new Date(record.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '12px' }}>{record.employee?.name || 'N/A'}</td>
                                        <td style={{ padding: '12px' }}>
                                            {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : 'N/A'}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : 'N/A'}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <span className={`status-badge ${
                                                record.status === 'PRESENT' ? 'success' : 'warning'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HRAttendanceReports;
