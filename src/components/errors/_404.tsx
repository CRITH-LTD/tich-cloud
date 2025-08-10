import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search, BookOpen } from "lucide-react";
import { Logo } from "../Common/Logo";

// Add custom CSS animations
const style = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.8s ease-out;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  @keyframes gradient-shift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
  
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient-shift 8s ease infinite;
  }
`;

export default function Error404() {
  return (
    <>
      <style>{style}</style>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 animate-gradient flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Circles */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-indigo-200/40 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '3s'}}></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-slate-200/50 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-blue-300/40 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '4s'}}></div>
        
        {/* Floating Squares */}
        <div className="absolute top-60 left-1/4 w-12 h-12 bg-indigo-200/30 rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-slate-300/40 rotate-45 animate-spin" style={{animationDelay: '3s', animationDuration: '6s'}}></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-gradient-radial from-blue-200/20 to-transparent rounded-full animate-pulse" style={{animationDelay: '1.5s', animationDuration: '4s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-gradient-radial from-indigo-200/25 to-transparent rounded-full animate-pulse" style={{animationDelay: '2.5s', animationDuration: '5s'}}></div>
      </div>

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg text-center relative z-10 animate-fade-in">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <Logo theme="dark" />
        </div>

        {/* Error Code */}
        <div className="mb-6">
          <h1 className="text-8xl font-bold text-gray-200 mb-2 animate-float">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Chai!! <br />
            Don't worry, it happens to the best of us.
            {/* This might happen due to a mistyped URL or an outdated link. */}
          </p>
        </div>

        {/* Helpful Suggestions */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            What you can do:
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
            <div className="flex items-center justify-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>Check the URL for typos or errors</span>
            </div>
            <div className="flex items-center justify-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <BookOpen className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>Browse our available resources</span>
            </div>
            <div className="flex items-center justify-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Home className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>Return to the homepage</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>

        {/* Footer Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Need assistance? Contact our support team or visit our help center.
          </p>
        </div>
      </div>
      </div>
    </>
  );
}