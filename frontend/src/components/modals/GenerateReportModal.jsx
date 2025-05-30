import { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import ToggleSwitch from '../ui/ToggleSwitch';

const GenerateReportModal = ({ isOpen, onClose, device, onGenerate }) => {
  const { darkMode } = useContext(ThemeContext);
  const [settings, setSettings] = useState({
    timeRange: 'week', // day, week, month, custom
    customStartDate: '',
    customEndDate: '',
    reportFormat: 'pdf', // pdf, csv, both
    includeCharts: true,
    includeSummary: true,
    includeAlerts: true,
    includeRawData: false,
    customTitle: '',
    customMessage: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Calculate date range
      let startDate, endDate = new Date();
      
      if (settings.timeRange === 'custom') {
        startDate = new Date(settings.customStartDate);
        endDate = new Date(settings.customEndDate);
      } else {
        startDate = new Date();
        if (settings.timeRange === 'day') {
          startDate.setDate(startDate.getDate() - 1);
        } else if (settings.timeRange === 'week') {
          startDate.setDate(startDate.getDate() - 7);
        } else if (settings.timeRange === 'month') {
          startDate.setMonth(startDate.getMonth() - 1);
        }
      }

      const reportData = {
        ...settings,
        deviceId: device.deviceId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        generatedAt: new Date().toISOString()
      };

      await onGenerate(reportData);
      onClose();
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
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
        <div className={`relative w-full max-w-lg transform rounded-lg shadow-xl transition-all ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Generate Report
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
            {/* Time Range */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Time Period
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'day', label: 'Last 24 Hours' },
                  { value: 'week', label: 'Last Week' },
                  { value: 'month', label: 'Last Month' },
                  { value: 'custom', label: 'Custom Range' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange('timeRange', option.value)}
                    className={`p-3 text-sm rounded-lg border transition-colors text-left ${
                      settings.timeRange === option.value
                        ? darkMode
                          ? 'border-blue-500 bg-blue-900/20 text-blue-400'
                          : 'border-blue-500 bg-blue-50 text-blue-700'
                        : darkMode
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Date Range */}
            {settings.timeRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={settings.customStartDate}
                    onChange={(e) => handleInputChange('customStartDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={settings.customEndDate}
                    onChange={(e) => handleInputChange('customEndDate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Report Format */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Download Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'pdf', label: 'PDF', icon: '📄' },
                  { value: 'csv', label: 'CSV', icon: '📊' },
                  { value: 'both', label: 'Both', icon: '📋' }
                ].map((format) => (
                  <button
                    key={format.value}
                    onClick={() => handleInputChange('reportFormat', format.value)}
                    className={`p-3 text-sm rounded-lg border transition-colors ${
                      settings.reportFormat === format.value
                        ? darkMode
                          ? 'border-blue-500 bg-blue-900/20 text-blue-400'
                          : 'border-blue-500 bg-blue-50 text-blue-700'
                        : darkMode
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">{format.icon}</div>
                      <div>{format.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Report Content */}
            <div className="space-y-4">
              <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Include in Report
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Weight Charts
                      </span>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Visual graphs and trends
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={settings.includeCharts}
                    onChange={(checked) => handleInputChange('includeCharts', checked)}
                    color="blue"
                    size="md"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Summary Statistics
                      </span>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Average, min, max values
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={settings.includeSummary}
                    onChange={(checked) => handleInputChange('includeSummary', checked)}
                    color="green"
                    size="md"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Alert History
                      </span>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Weight limit violations
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={settings.includeAlerts}
                    onChange={(checked) => handleInputChange('includeAlerts', checked)}
                    color="red"
                    size="md"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                    <div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Raw Data
                      </span>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        All measurement readings
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={settings.includeRawData}
                    onChange={(checked) => handleInputChange('includeRawData', checked)}
                    color="purple"
                    size="md"
                  />
                </div>
              </div>
            </div>

            {/* Custom Details */}
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Report Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Weekly Weight Report - Warehouse A"
                  value={settings.customTitle}
                  onChange={(e) => handleInputChange('customTitle', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Additional Notes (Optional)
                </label>
                <textarea
                  placeholder="Add any additional context or notes for this report..."
                  value={settings.customMessage}
                  onChange={(e) => handleInputChange('customMessage', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray rounded-b-lg">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                isGenerating
                  ? 'opacity-50 cursor-not-allowed'
                  : darkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || (settings.timeRange === 'custom' && (!settings.customStartDate || !settings.customEndDate))}
              className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isGenerating || (settings.timeRange === 'custom' && (!settings.customStartDate || !settings.customEndDate))
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReportModal;