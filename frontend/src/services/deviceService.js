import apiClient from './apiClient';

// Device services
const deviceService = {
  // Register a new device
  registerDevice: async (deviceData) => {
    try {
      const response = await apiClient.post('/devices', deviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user devices
  getUserDevices: async () => {
    try {
      const response = await apiClient.get('/devices');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a device by ID
  getDeviceById: async (deviceId) => {
    try {
      const response = await apiClient.get(`/devices/${deviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a device
  updateDevice: async (deviceId, deviceData) => {
    try {
      const response = await apiClient.put(`/devices/${deviceId}`, deviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Connect to an existing device
  connectToDevice: async (connectionData) => {
    try {
      const response = await apiClient.post('/devices/connect', connectionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a device
  deleteDevice: async (deviceId) => {
    try {
      const response = await apiClient.delete(`/devices/${deviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Убрали getAllDevices отсюда - он теперь в adminService
};

export default deviceService;