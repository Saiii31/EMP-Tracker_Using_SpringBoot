import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiClock, FiLogIn, FiLogOut, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../styles/ProfessionalDashboard.css';

const MyAttendance = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8081/api/attendance/my-attendance', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const attendanceData = response.data || [];
            setAttendance(attendanceData);
            
            // Find today's attendance
            const today = new Date().toDateString();
            const todayRecord = attendanceData.find(a => 
                new Date(a.date).toDateString() === today
            );
            setTodayAttendance(todayRecord);
        } catch (error) {
            toast.error('Failed to fetch attendance records');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8081/api/attendance/check-in', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Checked in successfully');
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to check in');
        }
    };

    const handleCheckOut = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8081/api/attendance/check-out', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Checked out successfully');
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to check out');
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
                    <h1>My Attendance</h1>
                    <p>View your attendance records and check in/out</p>
                </div>
            </div>

            <div className="dashboard-section" style={{ marginBottom: '2rem' }}>
                <h2>Today's Attendance</h2>
                {todayAttendance ? (
                    <div style={{
                        padding: '2rem',
                        background: '#f9fafb',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <FiCheckCircle size={48} style={{ color: '#10b981', marginBottom: '1rem' }} />
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#10b981' }}>
                            {todayAttendance.status === 'PRESENT' ? 'You are Present' : todayAttendance.status}
                        </h3>
                        {todayAttendance.checkInTime && (
                            <p style={{ color: '#666', margin: '0.5rem 0' }}>
                                <FiLogIn style={{ marginRight: '5px' }} />
                                Check-in: {new Date(todayAttendance.checkInTime).toLocaleTimeString()}
                            </p>
                        )}
                        {todayAttendance.checkOutTime && (
                            <p style={{ color: '#666', margin: '0.5rem 0' }}>
                                <FiLogOut style={{ marginRight: '5px' }} />
                                Check-out: {new Date(todayAttendance.checkOutTime).toLocaleTimeString()}
                            </p>
                        )}
                        {!todayAttendance.checkOutTime && (
                            <button
                                onClick={handleCheckOut}
                                className="btn btn-secondary"
                                style={{ marginTop: '1rem' }}
                            >
                                <FiLogOut style={{ marginRight: '8px' }} />
                                Check Out
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{
                        padding: '2rem',
                        background: '#f9fafb',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <FiClock size={48} style={{ color: '#667eea', marginBottom: '1rem' }} />
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                            Ready to check in?
                        </h3>
                        <p style={{ color: '#666', marginBottom: '1rem' }}>
                            Mark your attendance for today
                        </p>
                        <button
                            onClick={handleCheckIn}
                            className="btn btn-secondary"
                        >
                            <FiLogIn style={{ marginRight: '8px' }} />
                            Check In
                        </button>
                    </div>
                )}
            </div>

            <div className="dashboard-section">
                <h2>Attendance History</h2>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {attendance.map(record => (
                            <div
                                key={record.id}
                                style={{
                                    padding: '1rem',
                                    background: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600', color: '#333' }}>
                                        {new Date(record.date).toLocaleDateString()}
                                    </p>
                                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                                        {record.checkInTime && `In: ${new Date(record.checkInTime).toLocaleTimeString()}`}
                                        {record.checkInTime && record.checkOutTime && ' | '}
                                        {record.checkOutTime && `Out: ${new Date(record.checkOutTime).toLocaleTimeString()}`}
                                    </p>
                                </div>
                                <span className={`status-badge ${
                                    record.status === 'PRESENT' ? 'success' : 'warning'
                                }`}>
                                    {record.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAttendance;
