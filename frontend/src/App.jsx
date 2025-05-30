import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import BuyDevice from "./pages/BuyDevice";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./context/ThemeContext";
import { authService } from "./services";

// Protected route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  const userRole = authService.getUserRole();

  // Отладочная информация
  console.log('ProtectedRoute check:', {
    isAuthenticated,
    isAdmin,
    userRole,
    requireAdmin
  });

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    console.log('Admin required but user is not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      const adminStatus = authService.isAdmin();
      const userRole = authService.getUserRole();
      
      console.log('Auth check:', {
        authenticated,
        adminStatus,
        userRole,
        localStorage: {
          token: !!localStorage.getItem('token'),
          role: localStorage.getItem('role'),
          user: localStorage.getItem('user')
        }
      });
      
      setIsLoggedIn(authenticated);
      setIsAdmin(adminStatus);
    };

    checkAuth();
    
    // Setup listener for storage events (for logout across tabs)
    const handleStorageChange = () => {
      console.log('Storage changed, rechecking auth');
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    console.log('Logging out user');
    authService.logout();
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          isAdmin={isAdmin} 
          onLogout={handleLogout} 
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={
                isLoggedIn ? (
                  <Navigate to={isAdmin ? "/admin" : "/dashboard"} />
                ) : (
                  <Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                isLoggedIn ? (
                  <Navigate to={isAdmin ? "/admin" : "/dashboard"} />
                ) : (
                  <Register />
                )
              } 
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buy-device"
              element={
                <ProtectedRoute>
                  <BuyDevice />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;