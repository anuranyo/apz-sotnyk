import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { deviceService } from "../services";

const BuyDevice = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    deviceType: "standard",
    numberOfScales: 4,
    name: "",
    location: "",
    notes: "",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // In a real app, this would process the payment first
      
      // Register the device
      const deviceData = {
        name: formData.name,
        numberOfScales: parseInt(formData.numberOfScales),
        location: formData.location,
        notes: formData.notes
      };
      
      const response = await deviceService.registerDevice(deviceData);
      
      setSuccessMessage("Device registered successfully! Device ID: " + response.device.deviceId);
      
      // Navigate to dashboard after a delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Device registration error:", error);
      setError(typeof error === 'string' ? error : error.message || "Failed to register device");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.deviceType) {
      setError("Please select a device type");
      return;
    }
    
    if (step === 2 && !formData.name) {
      setError("Please enter a device name");
      return;
    }
    
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const deviceTypes = [
    {
      id: "basic",
      name: "Basic",
      price: 29,
      description: "Perfect for simple monitoring needs.",
      features: ["1 scale connection", "Real-time monitoring", "Basic alerts", "7-day data history"]
    },
    {
      id: "standard",
      name: "Standard",
      price: 49,
      description: "Our most popular device for everyday use.",
      features: ["4 scale connections", "Real-time monitoring", "Advanced alerts", "30-day data history", "Basic analytics"]
    },
    {
      id: "premium",
      name: "Premium",
      price: 99,
      description: "Professional-grade monitoring for demanding environments.",
      features: ["Unlimited scale connections", "Real-time monitoring", "Advanced alerts", "Unlimited data history", "Advanced analytics", "API access"]
    }
  ];

  return (
    <div className={`pt-20 ${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      <div className="px-4 mx-auto max-w-screen-xl sm:px-6 lg:px-8 py-8">
        <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Buy a Device</h1>
        <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Select a device type and complete your purchase.
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

        <div className="mt-8">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center relative ${step >= 1 ? "text-blue-600" : darkMode ? "text-gray-500" : "text-gray-400"}`}>
                <div className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${
                  step >= 1 
                    ? "border-blue-600 bg-blue-600 text-white" 
                    : darkMode 
                      ? "border-gray-500" 
                      : "border-gray-300"
                } flex items-center justify-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                  </svg>
                </div>
                <div className={`absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium ${
                  step >= 1 
                    ? "text-blue-600" 
                    : darkMode 
                      ? "text-gray-500" 
                      : "text-gray-400"
                }`}>
                  Select Device
                </div>
              </div>
              <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
                step >= 2 
                  ? "border-blue-600" 
                  : darkMode 
                    ? "border-gray-500" 
                    : "border-gray-300"
              }`}></div>
              <div className={`flex items-center relative ${step >= 2 ? "text-blue-600" : darkMode ? "text-gray-500" : "text-gray-400"}`}>
                <div className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${
                  step >= 2 
                    ? "border-blue-600 bg-blue-600 text-white" 
                    : darkMode 
                      ? "border-gray-500" 
                      : "border-gray-300"
                } flex items-center justify-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <div className={`absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium ${
                  step >= 2 
                    ? "text-blue-600" 
                    : darkMode 
                      ? "text-gray-500" 
                      : "text-gray-400"
                }`}>
                  Device Details
                </div>
              </div>
              <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
                step >= 3 
                  ? "border-blue-600" 
                  : darkMode 
                    ? "border-gray-500" 
                    : "border-gray-300"
              }`}></div>
              <div className={`flex items-center relative ${step >= 3 ? "text-blue-600" : darkMode ? "text-gray-500" : "text-gray-400"}`}>
                <div className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${
                  step >= 3 
                    ? "border-blue-600 bg-blue-600 text-white" 
                    : darkMode 
                      ? "border-gray-500" 
                      : "border-gray-300"
                } flex items-center justify-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className={`absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium ${
                  step >= 3 
                    ? "text-blue-600" 
                    : darkMode 
                      ? "text-gray-500" 
                      : "text-gray-400"
                }`}>
                  Payment
                </div>
              </div>
            </div>
          </div>

          {/* Content based on step */}
          <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} animate-fade-in`}>
            {step === 1 && (
              <div>
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Select a Device Type</h2>
                <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Choose the device that best fits your monitoring needs.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {deviceTypes.map((type) => (
                    <div 
                      key={type.id}
                      className={`relative rounded-lg border p-4 flex flex-col ${
                        formData.deviceType === type.id 
                          ? "border-blue-600" 
                          : darkMode 
                            ? "border-gray-700" 
                            : "border-gray-300"
                      } ${
                        formData.deviceType === type.id 
                          ? darkMode 
                            ? "bg-blue-900 bg-opacity-20" 
                            : "bg-blue-50" 
                          : ""
                      } cursor-pointer hover:border-blue-500 transition-colors duration-200`}
                      onClick={() => {
                        setFormData({ 
                          ...formData, 
                          deviceType: type.id,
                          numberOfScales: type.id === 'basic' ? 1 : type.id === 'standard' ? 4 : 8
                        });
                      }}
                    >
                      {formData.deviceType === type.id && (
                        <div className="absolute top-0 right-0 p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{type.name}</h3>
                        <p className="mt-2 text-blue-600 text-2xl font-bold">${type.price}</p>
                        <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{type.description}</p>
                        <ul className={`mt-4 space-y-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {type.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Device Details</h2>
                <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Configure your device settings.
                </p>

                <form className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Device Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Warehouse Scale 1"
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border-gray-300 text-gray-900"
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Device Location (Optional)
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Warehouse B, Kitchen, etc."
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any additional information about this device..."
                      rows="3"
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border-gray-300 text-gray-900"
                      }`}
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="numberOfScales" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Number of Scales
                    </label>
                    <select
                      id="numberOfScales"
                      name="numberOfScales"
                      value={formData.numberOfScales}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value={1} disabled={formData.deviceType !== 'basic'}>1 Scale</option>
                      <option value={2} disabled={formData.deviceType === 'basic'}>2 Scales</option>
                      <option value={3} disabled={formData.deviceType === 'basic'}>3 Scales</option>
                      <option value={4} disabled={formData.deviceType === 'basic'}>4 Scales</option>
                      {formData.deviceType === 'premium' && (
                        <>
                          <option value={6}>6 Scales</option>
                          <option value={8}>8 Scales</option>
                        </>
                      )}
                    </select>
                    <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Select how many scales you want to connect to this device.
                    </p>
                  </div>
                </form>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                      darkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Payment Information</h2>
                <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Complete your purchase securely.
                </p>

                <div className="mt-6">
                  <div className={`rounded-md bg-blue-50 p-4 ${darkMode ? "bg-blue-900 bg-opacity-20" : ""}`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Order Summary</h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                          <div className="flex justify-between mb-1">
                            <span>Device Type:</span>
                            <span className="font-medium">
                              {deviceTypes.find(type => type.id === formData.deviceType)?.name}
                            </span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span>Number of Scales:</span>
                            <span className="font-medium">{formData.numberOfScales}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span>Price:</span>
                            <span className="font-medium">
                              ${deviceTypes.find(type => type.id === formData.deviceType)?.price}
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-blue-200 dark:border-blue-800 pt-1 mt-1 font-bold">
                            <span>Total:</span>
                            <span>
                              ${deviceTypes.find(type => type.id === formData.deviceType)?.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div>
                      <label htmlFor="cardNumber" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "border-gray-300 text-gray-900"
                        }`}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiry" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiry"
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "border-gray-300 text-gray-900"
                          }`}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="cvc" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          CVC
                        </label>
                        <input
                          type="text"
                          id="cvc"
                          name="cvc"
                          value={formData.cvc}
                          onChange={handleChange}
                          placeholder="123"
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "border-gray-300 text-gray-900"
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        required
                      />
                      <label htmlFor="terms" className={`ml-2 block text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        I agree to the{" "}
                        <a href="#" className="text-blue-600 hover:text-blue-500">
                          Terms and Conditions
                        </a>
                      </label>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                          darkMode
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          <>
                            Complete Purchase
                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyDevice;