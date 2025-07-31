import { ArrowRight, Play, GraduationCap } from 'lucide-react';
import { Link } from 'react-router';
import useDashboardLayout from '../pages/Dashboard/dashboard.hooks';

const Hero = () => {
  const { user } = useDashboardLayout();

  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23dbeafe%22%20fill-opacity%3D%220.3%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8 animate-fade-in">
            <GraduationCap className="mr-2 h-4 w-4" />
            Trusted by 50+ Educational Institutions Nationwide
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Build and Scale Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Institution digitally
            </span>
            <span className="block text-4xl md:text-5xl text-gray-700 mt-2">
              with TICH
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Launch a fully-customized University Management System in minutes — built for the unique needs of educational institutions. Scalable, modular, and cloud-native.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="group bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-2xl hover:shadow-3xl flex items-center"
            >
              {user ? "Continue to Dashboard" : "Get Started Free"} 
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="group flex items-center text-gray-700 hover:text-blue-600 transition-colors font-semibold text-lg">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg mr-3 group-hover:shadow-xl transition-shadow">
                <Play className="h-5 w-5 ml-0.5" />
              </div>
              Schedule a Demo
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center opacity-60 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-600">System Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">Institutes Registered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2M+</div>
              <div className="text-sm text-gray-600">Students Supported</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-sm text-gray-600">Regions Nationally</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;