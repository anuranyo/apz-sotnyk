import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { adminService } from "../services";

const AdminDashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDevices: 0,
    activeDevices: 0,
    totalReadings: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentDevices, setRecentDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "user" or "device"
  const [editType, setEditType] = useState(""); // "user" or "device"
  
  // Form states for editing
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get all devices (admin only)
      const devicesResponse = await adminService.getAllDevices();
      setRecentDevices(devicesResponse.devices);
      
      // Get admin stats
      try {
        const statsResponse = await adminService.getAdminStats();
        setStats(statsResponse);
      } catch (statsError) {
        console.warn('Stats endpoint not available, calculating from devices data');
        const activeDevices = devicesResponse.devices.filter(device => device.status === 'active').length;
        
        setStats({
          totalUsers: devicesResponse.devices.length > 0 ? 
            [...new Set(devicesResponse.devices.map(d => d.owner?.id))].length : 0,
          totalDevices: devicesResponse.devices.length,
          activeDevices: activeDevices,
          totalReadings: 0
        });
      }
      
      // Extract unique users from devices
      const uniqueUsers = [];
      const userIds = new Set();
      
      devicesResponse.devices.forEach(device => {
        if (device.owner && !userIds.has(device.owner.id)) {
          userIds.add(device.owner.id);
          uniqueUsers.push({
            id: device.owner.id,
            name: device.owner.name,
            email: device.owner.email,
            role: 'user', // Default, would come from API in real scenario
            createdAt: new Date().toISOString().split('T')[0],
            devices: devicesResponse.devices.filter(d => d.owner?.id === device.owner.id).length
          });
        }
      });
      
      setRecentUsers(uniqueUsers);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setError("Failed to load admin data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete handlers
  const handleDeleteUser = (user) => {
    setSelectedItem(user);
    setDeleteType("user");
    setShowDeleteModal(true);
  };

  const handleDeleteDevice = (device) => {
    setSelectedItem(device);
    setDeleteType("device");
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (deleteType === "user") {
        await adminService.deleteUser(selectedItem.id);
        setRecentUsers(recentUsers.filter(user => user.id !== selectedItem.id));
      } else if (deleteType === "device") {
        // Assuming we have a deleteDevice method in adminService
        // await adminService.deleteDevice(selectedItem.deviceId);
        alert("Device deletion not implemented yet");
        setRecentDevices(recentDevices.filter(device => device.id !== selectedItem.id));
      }
      
      setShowDeleteModal(false);
      setSelectedItem(null);
      setDeleteType("");
      
      // Refresh data to update stats
      await fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item: " + error.message);
    }
  };

  // Edit handlers
  const handleEditUser = (user) => {
    setSelectedItem(user);
    setEditType("user");
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role || "user",
      status: "active"
    });
    setShowEditModal(true);
  };

  const handleEditDevice = (device) => {
    setSelectedItem(device);
    setEditType("device");
    setEditForm({
      name: device.name,
      email: "",
      role: "user",
      status: device.status
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      if (editType === "user") {
        await adminService.updateUserRole(selectedItem.id, editForm.role);
        // Update local state
        setRecentUsers(recentUsers.map(user => 
          user.id === selectedItem.id 
            ? { ...user, role: editForm.role }
            : user
        ));
      } else if (editType === "device") {
        // Device edit functionality would go here
        alert("Device editing not fully implemented yet");
      }
      
      setShowEditModal(false);
      setSelectedItem(null);
      setEditType("");
      
      // Refresh data
      await fetchData();
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item: " + error.message);
    }
  };

  return (
    <div className={`pt-20 ${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      <div className="px-4 mx-auto max-w-screen-xl sm:px-6 lg:px-8 py-8">
        <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Admin Dashboard</h1>
        <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Monitor and manage all users, devices, and system activities.
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8 animate-fade-in">
              <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-500 bg-opacity-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Total Users</p>
                    <p className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-500 bg-opacity-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Total Devices</p>
                    <p className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.totalDevices}</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-500 bg-opacity-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Active Devices</p>
                    <p className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.activeDevices}</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-500 bg-opacity-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Total Readings</p>
                    <p className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.totalReadings}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className={`mt-8 p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} animate-fade-in`}>
              <div className="flex justify-between mb-4">
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Recent Users</h2>
                <button className="text-blue-600 hover:text-blue-800">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}>Name</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}>Email</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}>Role</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}>Devices</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? "divide-gray-700" : "divide-gray-200"} divide-y`}>
                    {recentUsers.length > 0 ? (
                      recentUsers.map((user) => (
                        <tr key={user.id}>
                          <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {user.name}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {user.email}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === "admin" 
                                ? "bg-purple-100 text-purple-800" 
                                : "bg-green-100 text-green-800"
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {user.devices}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-800 mr-3"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Devices */}
            <div className={`mt-8 p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} animate-fade-in`}>
              <div className="flex justify-between mb-4">
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Recent Devices</h2>
                <button className="text-blue-600 hover:text-blue-800">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}>Device ID</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}>Name</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}>User</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}>Status</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}>Last Active</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? "divide-gray-700" : "divide-gray-200"} divide-y`}>
                    {recentDevices.length > 0 ? (
                      recentDevices.map((device) => (
                        <tr key={device.deviceId}>
                          <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {device.deviceId}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {device.name}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {device.owner ? device.owner.name : "N/A"}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap`}>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              device.status === "active" 
                                ? "bg-green-100 text-green-800" 
                                : device.status === "inactive" 
                                  ? "bg-gray-100 text-gray-800" 
                                  : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {device.status}
                            </span>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {device.lastActive ? new Date(device.lastActive).toLocaleString() : "Never"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleEditDevice(device)}
                              className="text-blue-600 hover:text-blue-800 mr-3"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteDevice(device)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No devices found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                  Delete {deleteType}
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete {deleteType === "user" ? selectedItem?.name : selectedItem?.name}? 
                    This action cannot be undone.
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedItem(null);
                      setDeleteType("");
                    }}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
                  Edit {editType}
                </h3>
                <div className="mt-4">
                  {editType === "user" && (
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Role
                      </label>
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  )}
                  
                  {editType === "device" && (
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Status
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center">
                    <button
                      onClick={handleEditSubmit}
                      className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedItem(null);
                        setEditType("");
                      }}
                      className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;