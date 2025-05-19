import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = ({ isLoggedIn, isAdmin, onLogout }) => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className={`fixed w-full z-10 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
      <div className="px-4 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Weight<span className="text-blue-600">Monitor</span>
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  window.location.pathname === "/"
                    ? "border-blue-500 text-blue-600"
                    : darkMode
                      ? "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-200"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Home
              </Link>

              {isLoggedIn && (
                <>
                  <Link
                    to="/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      window.location.pathname === "/dashboard"
                        ? "border-blue-500 text-blue-600"
                        : darkMode
                          ? "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-200"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/buy-device"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      window.location.pathname === "/buy-device"
                        ? "border-blue-500 text-blue-600"
                        : darkMode
                          ? "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-200"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Buy Device
                  </Link>
                </>
              )}

              {isLoggedIn && isAdmin && (
                <Link
                  to="/admin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    window.location.pathname === "/admin"
                      ? "border-blue-500 text-blue-600"
                      : darkMode
                        ? "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-200"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  : "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              }`}
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {isLoggedIn ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      U
                    </div>
                  </button>
                </div>
                {profileMenuOpen && (
                  <div
                    className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                      darkMode ? "bg-gray-700" : "bg-white"
                    } ring-1 ring-black ring-opacity-5 focus:outline-none`}
                  >
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 text-sm ${
                        darkMode
                          ? "text-gray-300 hover:bg-gray-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className={`block px-4 py-2 text-sm ${
                        darkMode
                          ? "text-gray-300 hover:bg-gray-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className={`block px-4 py-2 text-sm ${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-600"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        darkMode
                          ? "text-gray-300 hover:bg-gray-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm rounded-md ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="ml-2 px-4 py-2 text-sm text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </div>
            )}

            <div className="flex sm:hidden">
              <button
                onClick={toggleMobileMenu}
                className={`ml-2 p-2 rounded-md ${
                  darkMode
                    ? "text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    : "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                }`}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${mobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${mobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${mobileMenuOpen ? "block" : "hidden"} sm:hidden`}>
        <div className={`pt-2 pb-3 space-y-1 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <Link
            to="/"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              window.location.pathname === "/"
                ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-25"
                : darkMode
                  ? "border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  window.location.pathname === "/dashboard"
                    ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-25"
                    : darkMode
                      ? "border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/buy-device"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  window.location.pathname === "/buy-device"
                    ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-25"
                    : darkMode
                      ? "border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Buy Device
              </Link>
              <Link
                to="/profile"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  window.location.pathname === "/profile"
                    ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-25"
                    : darkMode
                      ? "border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    window.location.pathname === "/admin"
                      ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-25"
                      : darkMode
                        ? "border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300"
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  darkMode
                    ? "border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Sign out
              </button>
            </>
          )}
          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  window.location.pathname === "/login"
                    ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-25"
                    : darkMode
                      ? "border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  window.location.pathname === "/register"
                    ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-25"
                    : darkMode
                      ? "border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;