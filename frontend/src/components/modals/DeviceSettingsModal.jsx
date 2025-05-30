import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const DeviceSettingsModal = ({ isOpen, onClose, device, onSave, onDelete }) => {
  const { darkMode } = useContext(ThemeContext);
  const [settings, setSettings] = useState({
    name: '',
    location: '',
    description: '',
    units: 'kg', // kg, lbs
    precision: 2, // decimal places
    readingInterval: 60, // seconds
    autoCalibration: true,
    dataRetention: 365, // days
    timezone: 'UTC'
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (device) {
      setSettings({
        name: device.name || '',
        location: device.location || '',
        description: device.description || '',
        units: device.units || 'kg',
        precision: device.precision || 2,
        readingInterval: device.readingInterval || 60,
        autoCalibration: device.autoCalibration ?? true,
        dataRetention: device.dataRetention || 365,
        timezone: device.timezone || 'UTC'
      });
    }
  }, [device]);

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDelete = () => {
    onDelete(device.deviceId);
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full max-w-lg transform rounded-lg shadow-xl transition-all ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Device Settings
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Basic Information
              </h4>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Device Name
                </label>
                <input
                  type="text"
                  placeholder="My Scale Device"
                  value={settings.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Warehouse A, Section 1"
                  value={settings.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea
                  placeholder="Brief description of this device..."
                  value={settings.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={2}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            {/* Measurement Settings */}
            <div className="space-y-4">
              <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Measurement Settings
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Units
                  </label>
                  <select
                    value={settings.units}
                    onChange={(e) => handleInputChange('units', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lbs">Pounds (lbs)</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Precision
                  </label>
                  <select
                    value={settings.precision}
                    onChange={(e) => handleInputChange('precision', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value={0}>1 (no decimals)</option>
                    <option value={1}>1.0 (1 decimal)</option>
                    <option value={2}>1.00 (2 decimals)</option>
                    <option value={3}>1.000 (3 decimals)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Reading Interval: {settings.readingInterval} seconds
                </label>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="10"
                  value={settings.readingInterval}
                  onChange={(e) => handleInputChange('readingInterval', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10s</span>
                  <span>60s</span>
                  <span>300s</span>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="space-y-4">
              <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Advanced Settings
              </h4>
              
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Auto Calibration
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.autoCalibration}
                    onChange={(e) => handleInputChange('autoCalibration', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Data Retention (days)
                </label>
                <select
                  value={settings.dataRetention}
                  onChange={(e) => handleInputChange('dataRetention', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={365}>1 year</option>
                  <option value={730}>2 years</option>
                  <option value={-1}>Forever</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className={`text-sm font-medium text-red-600 dark:text-red-400 mb-3`}>
                Danger Zone
              </h4>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-red-800 transition-colors"
              >
                Delete Device
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                darkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-75" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className={`relative w-full max-w-sm transform rounded-lg shadow-xl transition-all ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-medium text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Delete Device
                </h3>
                <p className={`text-sm text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Are you sure you want to delete this device? All associated data will be permanently removed.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                      darkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceSettingsModal;