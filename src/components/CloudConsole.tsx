import React from 'react';
import { Plus, Settings, CreditCard, Users, BarChart3, Database, Shield, Zap } from 'lucide-react';

const CloudConsole = () => {
  const consoleItems = [
    { icon: Plus, title: 'Create New University', description: 'Launch a new institution in minutes', color: 'text-green-600 bg-green-50' },
    { icon: Settings, title: 'Manage Microservices', description: 'Configure and scale your services', color: 'text-blue-600 bg-blue-50' },
    { icon: CreditCard, title: 'Billing & Usage', description: 'Monitor costs and resource usage', color: 'text-purple-600 bg-purple-50' },
    { icon: Users, title: 'Tenant Settings', description: 'Manage users and permissions', color: 'text-indigo-600 bg-indigo-50' },
    { icon: BarChart3, title: 'Analytics Dashboard', description: 'Real-time insights and reports', color: 'text-orange-600 bg-orange-50' },
    { icon: Database, title: 'Data Management', description: 'Backup, restore, and migrate data', color: 'text-cyan-600 bg-cyan-50' },
    { icon: Shield, title: 'Security Center', description: 'Monitor and configure security', color: 'text-red-600 bg-red-50' },
    { icon: Zap, title: 'Performance Monitor', description: 'System health and optimization', color: 'text-yellow-600 bg-yellow-50' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Cloud Console
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your entire university infrastructure from a single, intuitive dashboard. 
            Built with the same principles as AWS Console, but designed for education.
          </p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">TICH Console</h3>
                <p className="text-gray-600">University of Technology - Main Campus</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                All Systems Operational
              </span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Deploy Service
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {consoleItems.map((item, index) => (
              <div 
                key={index}
                className="group p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className={`inline-flex p-3 rounded-lg ${item.color} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-xl">
            Access Console Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default CloudConsole;