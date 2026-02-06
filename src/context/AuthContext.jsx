import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE = 'http://localhost:3001/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Validate token on mount
            setLoading(false);
            // Could add token validation here
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (username, password) => {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('adminToken', data.token);
        return data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('adminToken');
    };

    const getAuthHeaders = () => ({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, getAuthHeaders, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const API_BASE_URL = API_BASE;
