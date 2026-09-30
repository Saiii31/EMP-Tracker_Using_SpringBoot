import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiActivity, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../styles/ProfessionalDashboard.css';

const AdminAuditLogs = () => {
    const { user } = useAuth();
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    const fetchAuditLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8081/api/audit-logs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAuditLogs(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch audit logs');
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
                    <h1>Audit Logs</h1>
                    <p>View system activity and changes</p>
                </div>
                <button onClick={fetchAuditLogs} className="btn btn-secondary">
                    <FiRefreshCw style={{ marginRight: '8px' }} />
                    Refresh
                </button>
            </div>

            <div className="dashboard-section">
                {auditLogs.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        border: '2px dashed #e0e0e0'
                    }}>
                        <FiActivity size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                        <p style={{ color: '#6b7280', margin: 0 }}>No audit logs found</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {auditLogs.map(log => (
                            <div
                                key={log.id}
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
                                            {log.action} - {log.entityName}
                                        </h3>
                                        <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                                            <strong>Changed By:</strong> {log.changedByEmail}
                                        </p>
                                        <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                                            <strong>Entity ID:</strong> {log.entityId}
                                        </p>
                                        <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                                            <strong>Details:</strong> {log.details}
                                        </p>
                                        <span style={{ fontSize: '0.85rem', color: '#999' }}>
                                            {new Date(log.changedAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <span className={`status-badge ${
                                        log.action === 'CREATE' ? 'success' :
                                        log.action === 'UPDATE' ? 'primary' :
                                        log.action === 'DELETE' ? 'warning' :
                                        'secondary'
                                    }`}>
                                        {log.action}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAuditLogs;
