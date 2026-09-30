import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiCalendar, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../styles/ProfessionalDashboard.css';

const HRLeaveRequests = () => {
    const { user } = useAuth();
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const fetchLeaveRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8081/api/leave-requests/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaveRequests(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch leave requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8081/api/leave-requests/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Leave request approved');
            fetchLeaveRequests();
        } catch (error) {
            toast.error('Failed to approve leave request');
        }
    };

    const handleReject = async (id) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8081/api/leave-requests/${id}/reject`, reason, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Leave request rejected');
            fetchLeaveRequests();
        } catch (error) {
            toast.error('Failed to reject leave request');
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
                    <h1>Leave Requests</h1>
                    <p>Review and approve employee leave requests</p>
                </div>
                <button onClick={fetchLeaveRequests} className="btn btn-secondary">
                    <FiRefreshCw style={{ marginRight: '8px' }} />
                    Refresh
                </button>
            </div>

            <div className="dashboard-section">
                {leaveRequests.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        border: '2px dashed #e0e0e0'
                    }}>
                        <FiCalendar size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                        <p style={{ color: '#6b7280', margin: 0 }}>No pending leave requests</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {leaveRequests.map(request => (
                            <div
                                key={request.id}
                                style={{
                                    padding: '1.5rem',
                                    background: 'white',
                                    borderRadius: '12px',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                                            {request.employee?.name || 'Employee'}
                                        </h3>
                                        <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                                            <strong>Leave Type:</strong> {request.leaveType}
                                        </p>
                                        <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                                            <strong>Duration:</strong> {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                                        </p>
                                        <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                                            <strong>Reason:</strong> {request.reason}
                                        </p>
                                        <span className="status-badge warning">
                                            {request.status}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginLeft: '1rem' }}>
                                        <button
                                            onClick={() => handleApprove(request.id)}
                                            style={{
                                                padding: '10px 20px',
                                                background: '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <FiCheck />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(request.id)}
                                            style={{
                                                padding: '10px 20px',
                                                background: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <FiX />
                                            Reject
                                        </button>
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

export default HRLeaveRequests;
