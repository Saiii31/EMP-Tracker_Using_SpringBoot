import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiBell, FiCheck, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../styles/ProfessionalDashboard.css';

const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8081/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8081/api/notifications/count', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnreadCount(response.data || 0);
        } catch (error) {
            console.error('Failed to fetch unread count');
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8081/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Marked as read');
            fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8081/api/notifications/read-all', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('All notifications marked as read');
            fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const deleteNotification = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8081/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Notification deleted');
            fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            toast.error('Failed to delete notification');
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
                    <h1>Notifications</h1>
                    <p>You have {unreadCount} unread notifications</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={fetchNotifications} className="btn btn-secondary">
                        <FiRefreshCw style={{ marginRight: '8px' }} />
                        Refresh
                    </button>
                    {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="btn btn-secondary">
                            <FiCheck style={{ marginRight: '8px' }} />
                            Mark All Read
                        </button>
                    )}
                </div>
            </div>

            <div className="dashboard-section">
                {notifications.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        border: '2px dashed #e0e0e0'
                    }}>
                        <FiBell size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
                        <p style={{ color: '#6b7280', margin: 0 }}>No notifications</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {notifications.map(notification => (
                            <div
                                key={notification.id}
                                style={{
                                    padding: '1.5rem',
                                    background: notification.read ? '#f9fafb' : 'white',
                                    borderRadius: '12px',
                                    border: notification.read ? '1px solid #e0e0e0' : '2px solid #667eea',
                                    boxShadow: notification.read ? 'none' : '0 2px 8px rgba(102, 126, 234, 0.2)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                                        {notification.title}
                                    </h3>
                                    <p style={{ margin: '0 0 0.75rem 0', color: '#666', lineHeight: '1.6' }}>
                                        {notification.message}
                                    </p>
                                    <span style={{ fontSize: '0.85rem', color: '#999' }}>
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginLeft: '1rem' }}>
                                    {!notification.read && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            style={{
                                                padding: '8px',
                                                background: '#667eea',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            }}
                                            title="Mark as read"
                                        >
                                            <FiCheck />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        style={{
                                            padding: '8px',
                                            background: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                        }}
                                        title="Delete"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
