import { useState } from 'react';
import { Menu, X, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom'; // react-router-dom is safer here
import { pathnames } from '../routes/path-names';
import useDashboardLayout from '../pages/Dashboard/dashboard.hooks';
import { Logo } from './Common/Logo';
import UserMenu from '../pages/Dashboard/Topbar/UserMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    showMenu,
    setShowMenu,
    handleLogout,
    isLoading: loadingUser,
    user,
    dropdownRef,
  } = useDashboardLayout();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo theme="dark" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Platform', href: '#' },
              { label: 'Services', href: '#' },
              { label: 'Pricing', href: '#' },
              { label: 'Docs', href: '#' },
              { label: 'Support', href: '#' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Auth (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {loadingUser ? (
              <UserMenu
                user={null}
                showMenu={false}
                setShowMenu={setShowMenu}
                handleLogout={handleLogout}
                dropdownRef={dropdownRef}
                loading
              />
            ) : user ? (
              <>
                <HelpCircle className="h-5 w-5 cursor-pointer text-gray-600 transition-colors hover:text-gray-800" />
                <UserMenu
                  user={user}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  handleLogout={handleLogout}
                  dropdownRef={dropdownRef}
                  loading={false}
                />
              </>
            ) : (
              <>
                <Link
                  to={pathnames.SIGN_IN}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Console Login
                </Link>
                <Link
                  to={pathnames.SIGN_UP}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-xl"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 transform bg-black/40 backdrop-blur-sm transition-opacity ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        className={`fixed right-0 top-0 z-50 h-full w-72 transform bg-white shadow-xl transition-transform duration-300 md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <Logo theme="dark" />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-4 px-6 py-6">
          {['Platform', 'Services', 'Pricing', 'Docs', 'Support'].map((label) => (
            <Link
              key={label}
              to="#"
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-gray-700 transition-colors hover:text-blue-600"
            >
              {label}
            </Link>
          ))}

          <div className="mt-6 border-t border-gray-200 pt-4">
            {user ? (
              <>
                {/* User Info */}
                <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-medium text-white">
                    {(user?.firstName || user?.email || 'U')
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user?.firstName || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </div>

                {/* User Links */}
                <Link
                  to="/dashboard"
                  className="block py-2 font-medium text-gray-700 transition-colors hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/profile"
                  className="block py-2 font-medium text-gray-700 transition-colors hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="block py-2 font-medium text-gray-700 transition-colors hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="mt-3 block w-full text-left py-2 font-medium text-red-600 transition-colors hover:text-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to={pathnames.SIGN_IN}
                  className="block py-2 font-medium text-gray-700 transition-colors hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Console Login
                </Link>
                <Link
                  to={pathnames.SIGN_UP}
                  className="mt-2 block rounded-lg bg-blue-600 px-6 py-2.5 text-center font-medium text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
