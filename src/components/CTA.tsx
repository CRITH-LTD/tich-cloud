import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import useDashboardLayout from '../pages/Dashboard/dashboard.hooks';
import { Link } from 'react-router';

const CTA = () => {
  const benefits = [
    'Free tier for up to 1,000 students',
    'No setup fees or hidden costs',
    'Deploy in under 30 minutes',
    '24/7 education-focused support'
  ];

  const { user } = useDashboardLayout();

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to transform your institution?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Join hundreds of universities worldwide who trust TICH for their digital infrastructure
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-white">
                <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-sm md:text-base">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to={user ? "/dashboard" : "/signup"} className="group bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-2xl flex items-center">
              {user ? "Continue to Dashboard" : "Get Started Free"}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="text-white border-2 border-white/30 px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200 font-semibold text-lg">
              Schedule Demo
            </button>
          </div>

          <p className="text-blue-200 text-sm mt-8">
            No credit card required • Free tier available • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;