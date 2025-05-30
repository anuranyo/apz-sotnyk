import apiClient from './apiClient';

// Auth services
const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login a user
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      
      if (response.data.token) {
        // Store token and user role - ИСПРАВЛЕНО: используем одинаковые ключи
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role); // Изменено с 'userRole' на 'role'
        
        // Дополнительно сохраним информацию о пользователе
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout a user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Изменено с 'userRole' на 'role'
    localStorage.removeItem('user');
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Check if user is admin - ИСПРАВЛЕНО: правильная проверка
  isAdmin: () => {
    const role = localStorage.getItem('role');
    console.log('Checking admin role:', role); // Для отладки
    return role === 'admin';
  },

  // Get current user data from localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get current user role
  getUserRole: () => {
    return localStorage.getItem('role');
  }
};

export default authService;