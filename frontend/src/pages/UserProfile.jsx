import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { authService, deviceService } from "../services";

const UserProfile = () => {
  const { darkMode } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch user data and devices
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Get user profile
        const userResponse = await authService.getProfile();
        setUser(userResponse.user);

        // Get user devices
        const devicesResponse = await deviceService.getUserDevices();
        setDevices(devicesResponse.devices);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    try {
      // Update user profile
      await authService.updateProfile({
        name: formData.name,
        email: formData.email
      });
      
      // Get updated user data
      const userResponse = await authService.getProfile();
      setUser(userResponse.user);
      
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(typeof error === 'string' ? error : error.message || 'Failed to update profile');
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    // Validate password match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    
    try {
      // Update user password
      await authService.updateProfile({
        password: formData.newPassword,
        currentPassword: formData.currentPassword
      });
      
      // Clear password fields
      setFormData(prevState => ({
        ...prevState,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      setSuccessMessage("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      setError(typeof error === 'string' ? error : error.message || 'Failed to update password');
    }
  };

  return (
    <div className={`pt-20 ${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      <div className="px-4 mx-auto max-w-screen-xl sm:px-6 lg:px-8 py-8">
        <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Your Profile</h1>
        <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Manage your account and device settings.
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <h2 className={`mt-4 text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{user?.name}</h2>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>{user?.email}</p>
                  <p className={`mt-2 px-3 py-1 text-xs rounded-full ${darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"}`}>
                    {user?.role === "admin" ? "Administrator" : "Regular User"}
                  </p>
                </div>

                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <nav className="flex flex-col space-y-2">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`px-4 py-2 rounded-md text-left ${
                        activeTab === "profile"
                          ? "bg-blue-600 text-white"
                          : darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={() => setActiveTab("devices")}
                      className={`px-4 py-2 rounded-md text-left ${
                        activeTab === "devices"
                          ? "bg-blue-600 text-white"
                          : darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Your Devices
                    </button>
                    <button
                      onClick={() => setActiveTab("security")}
                      className={`px-4 py-2 rounded-md text-left ${
                        activeTab === "security"
                          ? "bg-blue-600 text-white"
                          : darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Security
                    </button>
                  </nav>
                </div>

                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <p>Account created: {new Date(user?.createdAt).toLocaleDateString()}</p>
                    <p className="mt-1">Last login: {new Date(user?.lastLogin).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} animate-fade-in`}>
                  <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Profile Settings</h2>
                  <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Update your personal information.</p>

                  <form onSubmit={handleProfileSubmit} className="mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "border-gray-300 text-gray-900"
                          }`}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "border-gray-300 text-gray-900"
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "devices" && (
                <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} animate-fade-in`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Your Devices</h2>
                      <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Manage your connected weight monitoring devices.
                      </p>
                    </div>
                    <Link
                      to="/buy-device"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Device
                    </Link>
                  </div>

                  <div className="mt-6 overflow-x-auto">
                    {devices.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                          <tr>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
                              Device ID
                            </th>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
                              Name
                            </th>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
                              Status
                            </th>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
                              Scales
                            </th>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
                              Last Active
                            </th>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className={`${darkMode ? "bg-gray-800 divide-gray-700" : "bg-white divide-gray-200"}`}>
                          {devices.map((device) => (
                            <tr key={device.deviceId}>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                                {device.deviceId}
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                                {device.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  device.status === "active" 
                                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" 
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                }`}>
                                  {device.status}
                                </span>
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                                {device.numberOfScales}
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                                {device.lastActive ? new Date(device.lastActive).toLocaleString() : "Never"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <Link 
                                  to={`/device/${device.deviceId}`}
                                  className="text-blue-600 hover:text-blue-800 mr-2"
                                >
                                  View
                                </Link>
                                <Link 
                                  to={`/device/${device.deviceId}/edit`}
                                  className="text-blue-600 hover:text-blue-800 mr-2"
                                >
                                  Edit
                                </Link>
                                <button 
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this device?')) {
                                      deviceService.deleteDevice(device.deviceId)
                                        .then(() => {
                                          setDevices(devices.filter(d => d.deviceId !== device.deviceId));
                                          setSuccessMessage("Device deleted successfully!");
                                        })
                                        .catch(error => {
                                          console.error("Error deleting device:", error);
                                          setError("Failed to delete device. Please try again.");
                                        });
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className={`mt-2 text-md font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>No devices found</h3>
                        <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          You haven't added any devices yet.
                        </p>
                        <div className="mt-6">
                          <Link
                            to="/buy-device"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Your First Device
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} animate-fade-in`}>
                  <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Security Settings</h2>
                  <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Update your password and security preferences.
                  </p>

                  <form onSubmit={handleSecuritySubmit} className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "border-gray-300 text-gray-900"
                          }`}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="newPassword" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "border-gray-300 text-gray-900"
                          }`}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "border-gray-300 text-gray-900"
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>

                  <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Two-Factor Authentication</h3>
                    <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Add an extra layer of security to your account.
                    </p>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;