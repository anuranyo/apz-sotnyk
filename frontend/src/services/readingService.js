import apiClient from './apiClient';

// Reading services
const readingService = {
  // Get readings for a device
  getDeviceReadings: async (deviceId, params = {}) => {
    try {
      const response = await apiClient.get(`/readings/${deviceId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get latest reading for a device
  getLatestReading: async (deviceId) => {
    try {
      const response = await apiClient.get(`/readings/${deviceId}/latest`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get daily averages for a device
  getDailyAverages: async (deviceId, startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await apiClient.get(`/readings/${deviceId}/daily`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete readings for a device
  deleteDeviceReadings: async (deviceId, startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await apiClient.delete(`/readings/${deviceId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default readingService;