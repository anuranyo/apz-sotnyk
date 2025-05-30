import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import ToggleSwitch from '../ui/ToggleSwitch';

const WeightLimitModal = ({ isOpen, onClose, device, onSave }) => {
  const { darkMode } = useContext(ThemeContext);
  const [settings, setSettings] = useState({
    enabled: true,
    scale1Limit: 100,
    scale2Limit: 100,
    scale3Limit: 100,
    scale4Limit: 100,
    emailNotifications: true,
    pushNotifications: false,
    alertThreshold: 90 // Percentage of limit to trigger alert
  });

  useEffect(() => {
    if (device?.weightLimitSettings) {
      setSettings(device.weightLimitSettings);
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
        <div className={`relative w-full max-w-md transform rounded-lg shadow-xl transition-all ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Weight Limit Alerts
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Enable Weight Limit Alerts
                </label>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Get notified when weights exceed set limits
                </p>
              </div>
              <ToggleSwitch
                checked={settings.enabled}
                onChange={(checked) => handleInputChange('enabled', checked)}
                color="blue"
                size="md"
              />
            </div>

            {settings.enabled && (
              <>
                {/* Alert Threshold */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Alert Threshold ({settings.alertThreshold}% of limit)
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={settings.alertThreshold}
                      onChange={(e) => handleInputChange('alertThreshold', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${settings.alertThreshold - 50}%, ${darkMode ? '#374151' : '#e5e7eb'} ${settings.alertThreshold - 50}%, ${darkMode ? '#374151' : '#e5e7eb'} 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>50%</span>
                      <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>Current: {settings.alertThreshold}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Scale Limits */}
                <div>
                  <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Weight Limits (kg)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: device?.numberOfScales || 1 }, (_, index) => (
                      <div key={index} className="relative">
                        <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Scale {index + 1}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="1000"
                            step="0.1"
                            value={settings[`scale${index + 1}Limit`]}
                            onChange={(e) => handleInputChange(`scale${index + 1}Limit`, parseFloat(e.target.value) || 0)}
                            className={`w-full px-3 py-2 pr-8 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                          <span className={`absolute right-2 top-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            kg
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notification Options */}
                <div className="space-y-4">
                  <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Notification Methods
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Email Notifications
                          </span>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Send alerts to your email
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={settings.emailNotifications}
                        onChange={(checked) => handleInputChange('emailNotifications', checked)}
                        color="green"
                        size="md"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.429 4.429l12.728 12.728m-5.657-5.657L16 16m-8-8l4.5-4.5m0 0L8 8m4.5-4.5L16 8" />
                        </svg>
                        <div>
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Push Notifications
                          </span>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Instant alerts on your device
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={settings.pushNotifications}
                        onChange={(checked) => handleInputChange('pushNotifications', checked)}
                        color="purple"
                        size="md"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray rounded-b-lg">
            <button
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                darkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!settings.enabled}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                settings.enabled
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default WeightLimitModal;