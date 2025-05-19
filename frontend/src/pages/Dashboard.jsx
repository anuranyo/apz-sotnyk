import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { deviceService, readingService } from "../services";

const Dashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const [devices, setDevices] = useState([]);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [timeRange, setTimeRange] = useState("day"); // day, week, month
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user devices
        const response = await deviceService.getUserDevices();
        setDevices(response.devices);
        
        // If devices are available, select the first one and get its readings
        if (response.devices.length > 0) {
          setSelectedDevice(response.devices[0]);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
        setError("Failed to load devices. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch readings when selected device changes
  useEffect(() => {
    const fetchReadings = async () => {
      if (!selectedDevice) return;
      
      try {
        // Calculate date range based on timeRange
        const now = new Date();
        console.log("Current date:", now);
        console.log("Selected device:", selectedDevice);

        let startDate = new Date();
        
        if (timeRange === "day") {
          startDate.setDate(now.getDate() - 1);
        } else if (timeRange === "week") {
          startDate.setDate(now.getDate() - 7);
        } else if (timeRange === "month") {
          startDate.setMonth(now.getMonth() - 1);
        }

        console.log("Start date:", startDate);
        console.log("End date:", now);
        
        // Fetch readings for selected device with date range
        const params = {
          startDate: startDate.toISOString(),
          endDate: now.toISOString(),
          limit: 1000
        };
        
        const response = await readingService.getDeviceReadings(selectedDevice.deviceId, params);
        setReadings(response.readings);
      } catch (error) {
        console.error("Error fetching readings:", error);
        setError("Failed to load readings. Please try again later.");
      }
    };

    fetchReadings();
  }, [selectedDevice, timeRange]);

  // Select a device to display
  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  };

  return (
    <div className={`pt-20 ${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      <div className="px-4 mx-auto max-w-screen-xl sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Dashboard</h1>
            <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Monitor all your connected devices.
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
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar - Devices List */}
            <div className="md:col-span-1">
              <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Your Devices</h2>
                <div className="mt-4 space-y-4">
                  {devices.map(device => (
                    <div
                      key={device.deviceId}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedDevice?.deviceId === device.deviceId
                          ? darkMode
                            ? "bg-blue-900 bg-opacity-40"
                            : "bg-blue-50"
                          : darkMode
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleDeviceSelect(device)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{device.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          device.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}>
                          {device.status}
                        </span>
                      </div>
                      <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {device.numberOfScales} scale{device.numberOfScales !== 1 ? "s" : ""}
                      </p>
                      <p className={`mt-1 text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Last active: {device.lastActive ? formatDate(device.lastActive) : "Never"}
                      </p>
                    </div>
                  ))}

                  {devices.length === 0 && (
                    <div className={`p-4 rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                      <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        No devices found. Add your first device.
                      </p>
                      <div className="mt-4 text-center">
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
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content - Device Stats */}
            <div className="md:col-span-2">
              {selectedDevice ? (
                <div className="space-y-6">
                  {/* Device Overview Card */}
                  <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <div className="flex justify-between items-center">
                      <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedDevice.name}</h2>
                      <div className="flex space-x-2">
                        <button
                          className={`px-3 py-1 text-sm rounded-md ${
                            timeRange === "day"
                              ? "bg-blue-600 text-white"
                              : darkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => setTimeRange("day")}
                        >
                          Day
                        </button>
                        <button
                          className={`px-3 py-1 text-sm rounded-md ${
                            timeRange === "week"
                              ? "bg-blue-600 text-white"
                              : darkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => setTimeRange("week")}
                        >
                          Week
                        </button>
                        <button
                          className={`px-3 py-1 text-sm rounded-md ${
                            timeRange === "month"
                              ? "bg-blue-600 text-white"
                              : darkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => setTimeRange("month")}
                        >
                          Month
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Scale 1</p>
                        <p className={`mt-1 text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {readings.length > 0 ? readings[readings.length - 1].scale1.toFixed(2) : "0.00"} kg
                        </p>
                      </div>
                      {selectedDevice.numberOfScales >= 2 && (
                        <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Scale 2</p>
                          <p className={`mt-1 text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {readings.length > 0 ? readings[readings.length - 1].scale2.toFixed(2) : "0.00"} kg
                          </p>
                        </div>
                      )}
                      {selectedDevice.numberOfScales >= 3 && (
                        <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Scale 3</p>
                          <p className={`mt-1 text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {readings.length > 0 ? readings[readings.length - 1].scale3.toFixed(2) : "0.00"} kg
                          </p>
                        </div>
                      )}
                      {selectedDevice.numberOfScales >= 4 && (
                        <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Scale 4</p>
                          <p className={`mt-1 text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {readings.length > 0 ? readings[readings.length - 1].scale4.toFixed(2) : "0.00"} kg
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Recent Readings</h3>
                        <Link to={`/device/${selectedDevice.deviceId}/readings`} className="text-blue-600 hover:text-blue-500 text-sm">View All</Link>
                      </div>

                      <div className={`border rounded-md overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                            <tr>
                              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
                                Time
                              </th>
                              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
                                Scale 1
                              </th>
                              {selectedDevice.numberOfScales >= 2 && (
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
                                  Scale 2
                                </th>
                              )}
                              {selectedDevice.numberOfScales >= 3 && (
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
                                  Scale 3
                                </th>
                              )}
                              {selectedDevice.numberOfScales >= 4 && (
                                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
                                  Scale 4
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                            {readings.slice(0, 5).map((reading) => (
                              <tr key={reading.id} className={darkMode ? "bg-gray-800" : "bg-white"}>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                                  {formatDate(reading.timestamp)}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                                  {reading.scale1.toFixed(2)} kg
                                </td>
                                {selectedDevice.numberOfScales >= 2 && (
                                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                                    {reading.scale2.toFixed(2)} kg
                                  </td>
                                )}
                                {selectedDevice.numberOfScales >= 3 && (
                                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                                    {reading.scale3.toFixed(2)} kg
                                  </td>
                                )}
                                {selectedDevice.numberOfScales >= 4 && (
                                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                                    {reading.scale4.toFixed(2)} kg
                                  </td>
                                )}
                              </tr>
                            ))}
                            
                            {readings.length === 0 && (
                              <tr className={darkMode ? "bg-gray-800" : "bg-white"}>
                                <td colSpan={1 + selectedDevice.numberOfScales} className={`px-6 py-4 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  No readings found for this device.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Chart Card - This would be implemented with a chart library in a real app */}
                  <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <h3 className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Weight Trends</h3>
                    <div className="mt-4 h-64 flex items-center justify-center border border-dashed rounded-lg">
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Chart would appear here</p>
                        <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                          (Using a chart library like Chart.js or Recharts)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Settings Card */}
                  <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <h3 className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Device Settings</h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>Weight Limit Alerts</p>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>Daily Reports</p>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <Link to={`/device/${selectedDevice.deviceId}/settings`} className="text-blue-600 hover:text-blue-500">
                          Edit Device Settings
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} flex flex-col items-center justify-center h-96`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className={`mt-4 text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>No device selected</h3>
                  <p className={`mt-2 text-center max-w-md ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Select a device from the sidebar to view its details and readings.
                  </p>
                  {devices.length === 0 && (
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
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;