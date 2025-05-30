import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { authService } from "../services";

const Login = ({ setIsLoggedIn, setIsAdmin }) => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log('Attempting login with:', formData.email);
      
      // Call the login API
      const response = await authService.login({
        email: formData.email,
        password: formData.password
      });
      
      console.log('Login response:', response);
      
      // Determine user role - check multiple possible response formats
      let userRole = 'user'; // default role
      
      if (response.user && response.user.role) {
        userRole = response.user.role;
      } else if (response.role) {
        userRole = response.role;
      } else {
        // Fallback: determine role based on email for demo purposes
        if (formData.email === 'admin@example.com' || 
            formData.email === 'test@test.com' ||
            formData.email.includes('admin')) {
          userRole = 'admin';
        }
      }
      
      console.log('Determined user role:', userRole);
      
      // Force save role to localStorage (in case API doesn't do it properly)
      localStorage.setItem('role', userRole);
      
      // Also save user object with role
      const userObject = {
        ...response.user,
        role: userRole,
        email: formData.email
      };
      localStorage.setItem('user', JSON.stringify(userObject));
      
      console.log('Final localStorage state:', {
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role'),
        user: localStorage.getItem('user')
      });
      
      const isAdminUser = userRole === 'admin';
      
      // Update app state
      setIsLoggedIn(true);
      setIsAdmin(isAdminUser);
      
      // Navigate based on user role
      if (isAdminUser) {
        console.log('Navigating to admin dashboard');
        navigate("/admin");
      } else {
        console.log('Navigating to user dashboard');
        navigate("/dashboard");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      setError(typeof error === 'string' ? error : error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Quick login functions for demo
  const handleDemoLogin = (email, password, role) => {
    setFormData({ email, password, rememberMe: false });
    // Trigger login after state update
    setTimeout(() => {
      // Manually set the role and trigger login
      const mockResponse = {
        token: 'demo-token-' + Date.now(),
        user: { email, role, name: role === 'admin' ? 'Admin User' : 'Regular User' }
      };
      
      // Save to localStorage
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      // Update app state
      setIsLoggedIn(true);
      setIsAdmin(role === 'admin');
      
      // Navigate
      if (role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }, 100);
  };

  return (
    <div className={`pt-20 ${darkMode ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      <div className="px-4 mx-auto max-w-screen-xl sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto">
          <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} animate-fade-in`}>
            <div className="text-center">
              <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Log In</h1>
              <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Sign in to your account to access your dashboard.
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Quick Demo Login Buttons */}
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@example.com', 'admin123', 'admin')}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                🔑 Quick Admin Login
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('user@example.com', 'user123', 'user')}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
              >
                👤 Quick User Login
              </button>
            </div>

            <div className="mt-4 relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${darkMode ? "border-gray-700" : "border-gray-300"}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"}`}>
                  Or sign in manually
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className={`ml-2 block text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${darkMode ? "border-gray-700" : "border-gray-300"}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"}`}>
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <a
                  href="#"
                  className={`inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors ${
                    darkMode
                      ? "border-gray-700 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="#"
                  className={`inline-flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium transition-colors ${
                    darkMode
                      ? "border-gray-700 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            </div>

            <div className={`mt-4 p-3 rounded-md text-xs text-center ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              <p className="font-semibold mb-1">Demo Credentials:</p>
              <p>👑 Admin: admin@example.com / admin123</p>
              <p>👤 User: user@example.com / user123</p>
              <p className="mt-1 text-xs opacity-75">Or use the quick login buttons above!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;