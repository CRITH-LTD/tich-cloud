import React from 'react';
import { Zap, Building2, Shield, BarChart3, Workflow, Database } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: 'One-Click UMS Deployment',
      description: 'Launch your university\'s complete management system in minutes, not months. Pre-configured with best practices and ready to scale.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Building2,
      title: 'Modular Architecture',
      description: 'Choose only the services you need: student management, finance, exams, courses, HR, and more. Pay for what you use.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Multi-Tenant Security',
      description: 'Every university is fully isolated with its own secure cloud environment. Enterprise-grade security with zero configuration.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Monitor performance, student results, and engagement via powerful dashboards. Make data-driven decisions instantly.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Workflow,
      title: 'Event-Driven Engine',
      description: 'Kafka-powered automation across all systems. Seamless integration between modules with real-time data synchronization.',
      gradient: 'from-red-500 to-rose-500'
    },
    {
      icon: Database,
      title: 'Data Lake Integration',
      description: 'Centralize and analyze institutional data effortlessly. Built-in data warehousing with advanced analytics capabilities.',
      gradient: 'from-indigo-500 to-blue-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything your university needs in the cloud
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From simple course management to complex multi-campus operations, TICH scales with your institution
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-xl">
            Explore All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;