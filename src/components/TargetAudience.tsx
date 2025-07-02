import React from 'react';
import { Users, Building, Globe } from 'lucide-react';

const TargetAudience = () => {
  const audiences = [
    {
      icon: Users,
      title: 'University Administrators',
      description: 'Streamline operations, reduce costs, and improve student experiences with our comprehensive management platform.',
      benefits: ['Reduce IT overhead by 70%', 'Faster decision making', 'Improved student satisfaction', 'Centralized operations'],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Building,
      title: 'Education Technology Teams',
      description: 'Focus on innovation instead of infrastructure. Deploy, scale, and manage educational services with enterprise-grade reliability.',
      benefits: ['Zero infrastructure management', 'Auto-scaling capabilities', 'Built-in monitoring', 'API-first architecture'],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Governments & Private Institutions',
      description: 'Launch new educational initiatives rapidly with our proven platform. From single schools to nationwide education systems.',
      benefits: ['Multi-tenant architecture', 'Compliance ready', 'Cost-effective scaling', 'Global deployment'],
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Built for education leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're managing a single campus or a nationwide education system, 
            TICH provides the infrastructure you need to succeed
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {audiences.map((audience, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300"
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${audience.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <audience.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {audience.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                {audience.description}
              </p>
              
              <ul className="space-y-3">
                {audience.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-8">
            Join institutions worldwide who trust TICH for their digital transformation
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-xl">
            Schedule a Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;