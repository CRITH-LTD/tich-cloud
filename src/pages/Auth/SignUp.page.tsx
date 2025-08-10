import { Link } from 'react-router-dom';
import { Cloud, Check, Building2, Users, GraduationCap, Shield, Globe, Zap, Eye, EyeOff } from 'lucide-react';
import { pathnames } from '../../routes/path-names';
import { useAuthForm } from './auth.hooks';
import LoadingSpinner from '../Dashboard/UMSCreationSteps/UMSSettings/components/LoadingSpinner';

const SignUp = () => {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    passwordMismatch,
    checkPasswordMatch,
    toggleConfirmPasswordVisibility,
  } = useAuthForm({ intent: "signup" });

  const benefits = [
    { icon: Check, text: 'Free tier for up to 1,000 students' },
    { icon: Zap, text: 'Deploy your UMS in under 30 minutes' },
    { icon: Shield, text: 'Enterprise-grade security included' },
    { icon: Globe, text: 'Global infrastructure with 99.9% uptime' },
    { icon: Users, text: '24/7 education-focused support' },
    { icon: Building2, text: 'GDPR and FERPA compliant by default' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TICH-style Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <Cloud className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TICH</span>
              <span className="text-sm text-gray-500 font-medium">Education Cloud</span>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Already have an account?</span>
              <Link
                to={pathnames.SIGN_IN}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Form (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {/* Breadcrumb */}
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <span className="mx-2">&gt;</span>
                <span className="text-gray-900">Create Account</span>
              </div>

              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Create your TICH account
                </h1>
                <p className="text-gray-600">
                  Start building your university's cloud infrastructure today. No credit card required.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First name *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last name *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Root user email address *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        placeholder="john.doe@university.edu"
                      />
                      <p className="text-xs text-gray-500 mt-1">We'll use this email for account notifications and support.</p>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone number *
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        placeholder="+237 673 412 567"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility()}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm password *
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                          placeholder="Confirm your password"
                        />


                        <button
                          type="button"
                          onClick={() => toggleConfirmPasswordVisibility()}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>

                      </div>
                    </div>
                  </div>
                  {passwordMismatch && (
                    <p className="text-sm text-red-600 mt-2">Passwords do not match</p>
                  )}
                </div>


                {/* Terms and Preferences */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      required
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                    />
                    <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700 underline">TICH Customer Agreement</a>
                      {' '}and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700 underline">Privacy Notice</a>
                      . *
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      id="subscribeToUpdates"
                      name="subscribeToUpdates"
                      type="checkbox"
                      checked={formData.subscribeToUpdates}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                    />
                    <label htmlFor="subscribeToUpdates" className="ml-3 text-sm text-gray-700">
                      I would like to receive marketing communications about TICH products, services, and events.
                      I can unsubscribe at any time.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  onMouseEnter={checkPasswordMatch}
                  disabled={
                    !formData.firstName ||
                    !formData.lastName ||
                    !formData.email ||
                    !formData.password ||
                    !formData.confirmPassword ||
                    !formData.phone ||
                    !formData.agreeToTerms ||
                    isSubmitting ||
                    formData.password !== formData.confirmPassword
                  }
                  className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2
    ${formData.password !== formData.confirmPassword
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    }
    disabled:bg-blue-200 disabled:text-white disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Creating your account
                    </>
                  ) : formData.password !== formData.confirmPassword ? (
                    "Passwords do not match"
                  ) : (
                    "Create TICH account"
                  )}
                </button>



              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 underline">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Benefits (1/3 width) */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Why TICH Education Cloud?
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <benefit.icon className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Join 500+ Institutions</h3>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">500+</div>
                    <div className="text-blue-200 text-xs">Universities worldwide</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">2M+</div>
                    <div className="text-blue-200 text-xs">Students served</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">50+</div>
                    <div className="text-blue-200 text-xs">Countries</div>
                  </div>
                </div>
              </div>
              <p className="text-blue-100 text-sm">
                Trusted by institutions worldwide for digital transformation.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Need help?</h4>
              <p className="text-sm text-gray-600 mb-3">
                Our education specialists are here to help you get started.
              </p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                Contact Sales →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;