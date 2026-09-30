import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8081/api/auth/login', {
                username,
                password
            });

            const { token, userId, username: userName, email, role } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ id: userId, username: userName, email, role }));

            setToken(token);
            setUser({ id: userId, username: userName, email, role });

            return { success: true, role };
        } catch (error) {
            console.error('Login error:', error.response?.data);
            let errorMessage = 'Login failed';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors) {
                // Handle validation errors
                const errors = error.response.data.errors;
                errorMessage = Object.values(errors).join(', ');
            }
            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const register = async (registerData) => {
        try {
            const response = await axios.post('http://localhost:8081/api/auth/register', registerData);
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error.response?.data);
            let errorMessage = 'Registration failed';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors) {
                // Handle validation errors
                const errors = error.response.data.errors;
                errorMessage = Object.values(errors).join(', ');
            }
            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = () => {
        return !!token;
    };

    const hasRole = (requiredRole) => {
        return user && user.role === requiredRole;
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        hasRole
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
