import { useState } from 'react';
import { Menu, X, ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router';
import { pathnames } from '../routes/path-names';
import useDashboardLayout from '../pages/Dashboard/dashboard.hooks';
import { Logo } from './Common/Logo';
import ShimmerLoader from './Common/ShimmerLoader ';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [notifications, setNotifications] = useState(2); // Mock notification count


  // Get user data from dashboard layout hook
   const { showMenu, setShowMenu, handleLogout, user, dropdownRef } = useDashboardLayout();

  // Define loadingUser as true if user is nullish (no user yet)
  const loadingUser = !user;


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Logo theme='dark' />

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Platform</Link>
            <Link to="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Services</Link>
            <Link to="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Pricing</Link>
            <Link to="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Documentation</Link>
            <Link to="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Support</Link>
          </nav>

          {/* User Authentication Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loadingUser ? (
              <>
                <ShimmerLoader
                  width={32}
                  height={32}
                  borderRadius="50%"
                  className="inline-block"
                />
                <div className="flex flex-col space-y-1 ml-3">
                  <ShimmerLoader width={80} height={12} borderRadius={4} />
                  <ShimmerLoader width={100} height={10} borderRadius={4} />
                </div>
                <ShimmerLoader width={16} height={16} borderRadius={4} className="ml-2" />
              </>
            ) : (
              user ? (
                <>
                  <HelpCircle className="h-5 w-5 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors" />

                  <div className="relative" ref={dropdownRef}>
                    <div
                      className="flex items-center space-x-2 hover:text-gray-800 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setShowMenu((prev) => !prev)}
                    >
                      <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {(user.firstName || user.email)?.charAt(0).toUpperCase() ?? ''}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {user.email ? user.email.split('@')[0] : ''}
                        </div>
                        <div className="text-xs text-gray-500">{user.email || ''}</div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    </div>

                    {showMenu && (
                      <div className="text-academic-900 absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                        {/* User dropdown menu content */}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* In case user is null but loadingUser false (unlikely) */}
                  <Link
                    to={pathnames.SIGN_IN}
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    Console Login
                  </Link>
                  <Link
                    to={pathnames.SIGN_UP}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-medium shadow-lg hover:shadow-xl"
                  >
                    Get Started Free
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Platform</Link>
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Services</Link>
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Pricing</Link>
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Documentation</Link>
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Support</Link>

              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    {/* Mobile User Info */}
                    <div className="flex items-center space-x-3 px-2 py-2 bg-gray-50 rounded-lg">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {(user?.firstName || user?.email || "U").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{user?.firstName || "User"}</div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                      </div>
                      {/* <div className="relative">
                        <Bell className="h-5 w-5 text-gray-600" />
                        {notifications > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {notifications}
                          </span>
                        )}
                      </div> */}
                    </div>

                    {/* Mobile User Menu Items */}
                    <Link
                      to="/dashboard"
                      className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-red-600 hover:text-red-700 transition-colors font-medium py-2"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to={pathnames.SIGN_IN} className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium">Console Login</Link>
                    <Link to={pathnames.SIGN_UP} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-left">
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header >
  );
};

export default Header;