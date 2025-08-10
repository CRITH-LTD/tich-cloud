import React from 'react';
import { Shield, Lock, Eye, FileCheck, Globe, Users } from 'lucide-react';

const TrustCompliance = () => {
  const complianceFeatures = [
    {
      icon: Shield,
      title: 'Secure Data Isolation',
      description: 'Every institution operates in a completely isolated environment with dedicated resources and encryption.',
      color: 'text-green-600 bg-green-50'
    },
    {
      icon: FileCheck,
      title: 'GDPR Compliance',
      description: 'Built-in data protection controls and automated compliance reporting for European regulations.',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: Eye,
      title: 'Student Privacy Controls',
      description: 'Granular privacy settings and consent management to protect student data and maintain trust.',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All data encrypted in transit and at rest using industry-standard AES-256 encryption.',
      color: 'text-red-600 bg-red-50'
    },
    {
      icon: Globe,
      title: 'Global Compliance',
      description: 'Meets international education standards including FERPA, COPPA, and local data protection laws.',
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      icon: Users,
      title: 'Access Controls',
      description: 'Role-based permissions with multi-factor authentication and audit trails for all user actions.',
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  const certifications = [
    'SOC 2 Type II',
    'ISO 27001',
    'GDPR Ready',
    'FERPA Compliant',
    'COPPA Certified',
    'HIPAA Ready'
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trust & Compliance First
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Security and privacy are not afterthoughts. TICH is built from the ground up 
            with enterprise-grade security and compliance for educational institutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {complianceFeatures.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300"
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Certifications & Standards
            </h3>
            <p className="text-gray-600">
              TICH meets the highest industry standards for security and compliance
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {certifications.map((cert, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-4 text-center border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-sm font-semibold text-gray-900">{cert}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Need specific compliance requirements? We work with institutions to meet custom regulatory needs.
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-xl">
            Discuss Compliance Needs
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrustCompliance;