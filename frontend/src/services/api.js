/**
 * API Service for ZAPI Frontend
 * Handles all HTTP requests to the backend
 */

const API_BASE = '/api';

// Helper function to handle responses
const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
    }

    return data;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('zapiToken');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Auth API
export const authAPI = {
    register: async (businessData) => {
        const response = await fetch(`${API_BASE}/business/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(businessData)
        });
        const data = await handleResponse(response);

        // Store token
        if (data.token) {
            localStorage.setItem('zapiToken', data.token);
            localStorage.setItem('zapiUser', JSON.stringify(data.business));
        }

        return data;
    },

    login: async (email, password) => {
        const response = await fetch(`${API_BASE}/business/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await handleResponse(response);

        // Store token
        if (data.token) {
            localStorage.setItem('zapiToken', data.token);
            localStorage.setItem('zapiUser', JSON.stringify(data.business));
        }

        return data;
    },

    logout: () => {
        localStorage.removeItem('zapiToken');
        localStorage.removeItem('zapiUser');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('zapiUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('zapiToken');
    }
};

// Business API
export const businessAPI = {
    getProfile: async () => {
        const response = await fetch(`${API_BASE}/business/profile`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    updateProfile: async (updates) => {
        const response = await fetch(`${API_BASE}/business/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updates)
        });
        return handleResponse(response);
    }
};

// Bookings API
export const bookingsAPI = {
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE}/bookings${queryString ? `?${queryString}` : ''}`;
        const response = await fetch(url, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getById: async (bookingId) => {
        const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    updateStatus: async (bookingId, status) => {
        const response = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        return handleResponse(response);
    }
};

// Dashboard API
export const dashboardAPI = {
    getStats: async () => {
        const response = await fetch(`${API_BASE}/dashboard/stats`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};

export default {
    auth: authAPI,
    business: businessAPI,
    bookings: bookingsAPI,
    dashboard: dashboardAPI
};
