import apiClient from './apiClient';

// Admin services
const adminService = {
  // Get admin dashboard statistics
  getAdminStats: async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all users (admin only)
  getAllUsers: async (params = {}) => {
    try {
      const response = await apiClient.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all devices (admin only)
  getAllDevices: async () => {
    try {
      const response = await apiClient.get('/admin/devices');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get system activity
  getSystemActivity: async (limit = 100) => {
    try {
      const response = await apiClient.get(`/admin/activity`, { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default adminService;