import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiBriefcase, FiPlus, FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../styles/ProfessionalDashboard.css';

const HRTaskManagement = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'MEDIUM',
        dueDate: ''
    });

    useEffect(() => {
        fetchTasks();
        fetchEmployees();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8081/api/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8081/api/employees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(response.data || []);
        } catch (error) {
            console.error('Failed to fetch employees');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingTask) {
                await axios.put(`http://localhost:8081/api/tasks/${editingTask.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Task updated successfully');
            } else {
                await axios.post('http://localhost:8081/api/tasks', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Task created successfully');
            }
            setShowModal(false);
            setEditingTask(null);
            setFormData({
                title: '',
                description: '',
                assignedTo: '',
                priority: 'MEDIUM',
                dueDate: ''
            });
            fetchTasks();
        } catch (error) {
            toast.error('Failed to save task');
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description,
            assignedTo: task.assignedTo,
            priority: task.priority,
            dueDate: task.dueDate
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8081/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Task deleted successfully');
            fetchTasks();
        } catch (error) {
            toast.error('Failed to delete task');
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
                    <h1>Task Management</h1>
                    <p>Assign and track tasks for employees</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={fetchTasks} className="btn btn-secondary">
                        <FiRefreshCw style={{ marginRight: '8px' }} />
                        Refresh
                    </button>
                    <button onClick={() => setShowModal(true)} className="btn btn-secondary">
                        <FiPlus style={{ marginRight: '8px' }} />
                        New Task
                    </button>
                </div>
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
                        <p style={{ color: '#6b7280', margin: 0 }}>No tasks found</p>
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
                                    border: '1px solid #e0e0e0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                                            {task.title}
                                        </h3>
                                        <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                                            {task.description}
                                        </p>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <span className={`status-badge ${
                                                task.status === 'COMPLETED' ? 'success' :
                                                task.status === 'IN_PROGRESS' ? 'primary' :
                                                'warning'
                                            }`}>
                                                {task.status}
                                            </span>
                                            <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                                Priority: {task.priority}
                                            </span>
                                            {task.dueDate && (
                                                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginLeft: '1rem' }}>
                                        <button
                                            onClick={() => handleEdit(task)}
                                            style={{
                                                padding: '8px',
                                                background: '#667eea',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            }}
                                            title="Edit"
                                        >
                                            <FiEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task.id)}
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
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '500px',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h2 style={{ margin: '0 0 1.5rem 0' }}>
                            {editingTask ? 'Edit Task' : 'Create New Task'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    required
                                    rows="3"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    Assign To
                                </label>
                                <select
                                    value={formData.assignedTo}
                                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    Priority
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn btn-secondary" style={{ flex: 1 }}>
                                    {editingTask ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingTask(null);
                                        setFormData({
                                            title: '',
                                            description: '',
                                            assignedTo: '',
                                            priority: 'MEDIUM',
                                            dueDate: ''
                                        });
                                    }}
                                    className="btn"
                                    style={{ flex: 1, background: '#e0e0e0', color: '#333' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HRTaskManagement;
