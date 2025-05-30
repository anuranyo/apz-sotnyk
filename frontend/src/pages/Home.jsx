import { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import homePic from "../assets/homePic.jpg";

const Home = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`pt-20 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      {/* Hero Section */}
      <section className="px-4 py-16 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex flex-col justify-center animate-fade-in">
            <h1 className={`text-4xl font-extrabold sm:text-5xl ${darkMode ? "text-white" : "text-gray-900"}`}>
              Smart Weight Monitoring
              <span className="block text-blue-600">For Modern Solutions</span>
            </h1>
            <p className={`mt-4 sm:text-xl ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
              Monitor weights in real-time, track inventory levels, and receive alerts when thresholds are exceeded.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="block w-full rounded bg-blue-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className={`block w-full rounded ${darkMode ? "bg-gray-800 text-white" : "bg-white text-blue-600"} px-12 py-3 text-sm font-medium shadow hover:text-blue-700 focus:outline-none focus:ring active:text-blue-500 sm:w-auto`}
              >
                Login
              </Link>
            </div>
          </div>
          <div className="relative animate-fade-in stagger-1">
            <img
              src={homePic}
              alt="Weight Scale"
              className="w-full rounded-lg shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`${darkMode ? "bg-gray-800" : "bg-gray-100"} py-16`}>
        <div className="px-4 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto text-center animate-fade-in">
            <h2 className={`text-3xl font-bold sm:text-4xl ${darkMode ? "text-white" : "text-gray-900"}`}>
              Powerful Features for Smart Monitoring
            </h2>
            <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
              Our intelligent weight monitoring system provides real-time data, powerful analytics, and customizable alerts.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-3">
            <div className={`p-8 shadow-lg rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} animate-slide-up stagger-1`}>
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-full text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className={`mb-4 text-xl font-bold text-center ${darkMode ? "text-white" : "text-gray-900"}`}>Real-Time Monitoring</h3>
              <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                Get instant updates on weight changes with our advanced IoT-enabled devices and MQTT communication.
              </p>
            </div>
            <div className={`p-8 shadow-lg rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} animate-slide-up stagger-2`}>
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-full text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className={`mb-4 text-xl font-bold text-center ${darkMode ? "text-white" : "text-gray-900"}`}>Smart Analytics</h3>
              <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                Visualize trends, track inventory changes, and make data-driven decisions with comprehensive analytics.
              </p>
            </div>
            <div className={`p-8 shadow-lg rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} animate-slide-up stagger-3`}>
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-full text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className={`mb-4 text-xl font-bold text-center ${darkMode ? "text-white" : "text-gray-900"}`}>Customizable Alerts</h3>
              <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                Set thresholds and receive instant notifications when weight limits are exceeded or inventory levels change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-16 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center animate-fade-in">
          <h2 className={`text-3xl font-bold sm:text-4xl ${darkMode ? "text-white" : "text-gray-900"}`}>
            How It Works
          </h2>
          <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
            Our intelligent weight monitoring system is easy to set up and use.
          </p>
        </div>

        <div className="mt-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-1/2 w-1 bg-blue-600 -ml-0.5 hidden md:block"></div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="md:pr-12 md:text-right animate-fade-in stagger-1">
                <div className="flex md:justify-end">
                  <span className="flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full md:absolute md:right-0 md:-ml-5">
                    1
                  </span>
                </div>
                <h3 className={`mt-4 text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Register and Connect</h3>
                <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                  Create an account and connect your weight monitoring devices to our secure platform.
                </p>
              </div>
              <div className="md:pl-12 animate-fade-in stagger-2">
                <div className="md:absolute md:left-0 md:-ml-5">
                  <span className="flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full">
                    2
                  </span>
                </div>
                <h3 className={`mt-4 text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Configure Settings</h3>
                <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                  Set weight thresholds, alert preferences, and customize your dashboard.
                </p>
              </div>
              <div className="md:pr-12 md:text-right animate-fade-in stagger-3">
                <div className="flex md:justify-end">
                  <span className="flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full md:absolute md:right-0 md:-ml-5">
                    3
                  </span>
                </div>
                <h3 className={`mt-4 text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Monitor in Real-Time</h3>
                <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                  View live data, track changes, and receive alerts when thresholds are exceeded.
                </p>
              </div>
              <div className="md:pl-12 animate-fade-in stagger-4">
                <div className="md:absolute md:left-0 md:-ml-5">
                  <span className="flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full">
                    4
                  </span>
                </div>
                <h3 className={`mt-4 text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Analyze and Optimize</h3>
                <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                  Use insights and analytics to optimize inventory management and improve efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={`${darkMode ? "bg-gray-800" : "bg-gray-100"} py-16`}>
        <div className="px-4 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto text-center animate-fade-in">
            <h2 className={`text-3xl font-bold sm:text-4xl ${darkMode ? "text-white" : "text-gray-900"}`}>
              Choose Your Plan
            </h2>
            <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
              Select the perfect plan for your monitoring needs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-3">
            <div className={`p-8 shadow-lg rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} animate-slide-up stagger-1`}>
              <h3 className={`text-2xl font-bold text-center ${darkMode ? "text-white" : "text-gray-900"}`}>Basic</h3>
              <p className="mt-4 text-center text-blue-600 text-4xl font-extrabold">$29</p>
              <p className={`mt-1 text-center ${darkMode ? "text-gray-400" : "text-gray-700"}`}>per device / month</p>
              <ul className={`mt-6 space-y-2 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  1 device connection
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time monitoring
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Basic alerts
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  7-day data history
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  to="/buy-device"
                  className="block w-full py-3 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className={`p-8 shadow-lg rounded-lg relative ${darkMode ? "bg-blue-900" : "bg-blue-50"} animate-slide-up stagger-2 animate-pulse`}>
              <div className="absolute top-0 right-0 py-1 px-3 bg-blue-600 text-white text-xs font-semibold rounded-bl-lg rounded-tr-lg">
                Popular
              </div>
              <h3 className={`text-2xl font-bold text-center ${darkMode ? "text-white" : "text-gray-900"}`}>Standard</h3>
              <p className="mt-4 text-center text-blue-600 text-4xl font-extrabold">$49</p>
              <p className={`mt-1 text-center ${darkMode ? "text-gray-400" : "text-gray-700"}`}>per device / month</p>
              <ul className={`mt-6 space-y-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  4 device connections
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time monitoring
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced alerts & customization
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  30-day data history
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Basic analytics
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  to="/buy-device"
                  className="block w-full py-3 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className={`p-8 shadow-lg rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} animate-slide-up stagger-3`}>
              <h3 className={`text-2xl font-bold text-center ${darkMode ? "text-white" : "text-gray-900"}`}>Premium</h3>
              <p className="mt-4 text-center text-blue-600 text-4xl font-extrabold">$99</p>
              <p className={`mt-1 text-center ${darkMode ? "text-gray-400" : "text-gray-700"}`}>per device / month</p>
              <ul className={`mt-6 space-y-2 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited device connections
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time monitoring
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced alerts & customization
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited data history
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced analytics & reports
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  API access & integrations
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  to="/buy-device"
                  className="block w-full py-3 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-16 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center animate-fade-in">
          <h2 className={`text-3xl font-bold sm:text-4xl ${darkMode ? "text-white" : "text-gray-900"}`}>
            What Our Customers Say
          </h2>
          <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
            Trusted by businesses worldwide for reliable weight monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
          <div className={`p-8 border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} rounded-lg shadow-lg animate-fade-in stagger-1`}>
            <div className={`text-xl italic ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              &ldquo;WeightMonitor has transformed our inventory management. We can track our stock levels in real-time and receive alerts before we run out of essential items.&rdquo;
            </div>
            <div className="flex items-center mt-8">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Testimonial Author"
              />
              <div className="ml-4">
                <p className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Michael Carter</p>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Operations Manager, TechFlow Inc.</p>
              </div>
            </div>
          </div>
          <div className={`p-8 border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} rounded-lg shadow-lg animate-fade-in stagger-2`}>
            <div className={`text-xl italic ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              &ldquo;The analytics and insights provided by WeightMonitor have helped us optimize our supply chain and reduce waste by over 30%. Excellent product!&rdquo;
            </div>
            <div className="flex items-center mt-8">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Testimonial Author"
              />
              <div className="ml-4">
                <p className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Sarah Johnson</p>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Supply Chain Director, GreenLeaf</p>
              </div>
            </div>
          </div>
          <div className={`p-8 border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} rounded-lg shadow-lg animate-fade-in stagger-3`}>
            <div className={`text-xl italic ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              &ldquo;Setting up the system was incredibly easy, and the customer support team was always available to help. The ROI on this investment has been incredible.&rdquo;
            </div>
            <div className="flex items-center mt-8">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="Testimonial Author"
              />
              <div className="ml-4">
                <p className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>David Wong</p>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>CTO, InnovateX Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`${darkMode ? "bg-blue-900" : "bg-blue-50"} py-16`}>
        <div className="px-4 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Transform Your Inventory Management?
            </h2>
            <p className={`mt-4 ${darkMode ? "text-blue-100" : "text-blue-800"}`}>
              Join thousands of businesses optimizing their operations with our intelligent weight monitoring system.
            </p>
            <div className="mt-8">
              <Link
                to="/register"
                className="inline-block px-8 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;