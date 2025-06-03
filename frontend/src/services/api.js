const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(url, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Admin methods
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/users${queryString ? `?${queryString}` : ''}`);
  }

  async getAllDevices() {
    return this.request('/admin/devices');
  }

  async updateUserRole(userId, role) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getSystemActivity(limit = 100) {
    return this.request(`/admin/activity?limit=${limit}`);
  }
}

export const apiService = new ApiService();
export const deviceService = {
  getAllDevices: () => apiService.getAllDevices(),
};
export const authService = apiService;