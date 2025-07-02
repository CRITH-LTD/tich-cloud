import React, { useState } from 'react';
import { Menu, X, Cloud } from 'lucide-react';
import { Link } from 'react-router';
import { pathnames } from '../routes/path-names';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Cloud className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TICH</span>
            <span className="text-sm text-gray-500 font-medium">Education Cloud</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Platform</Link>
            <Link to="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Services</Link>
            <Link to="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Pricing</Link>
            <Link to="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Documentation</Link>
            <Link to="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Support</Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to={pathnames.SIGN_IN} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Console Login</Link>
            <Link to={pathnames.SIGN_UP} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-medium shadow-lg hover:shadow-xl">
              Get Started Free
            </Link>
          </div>
          
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Platform</Link>
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Services</Link>
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Pricing</Link>
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Documentation</Link>
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Support</Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Link to={pathnames.SIGN_IN} className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium">Console Login</Link>
                <Link to={pathnames.SIGN_UP} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-left">
                  Get Started Free
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;