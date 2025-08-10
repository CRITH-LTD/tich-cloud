import React from 'react';
import { Server, Workflow, Database, Cloud, Zap, Shield } from 'lucide-react';

const Architecture = () => {
  const technologies = [
    { icon: Server, name: 'Kubernetes', description: 'Container orchestration and auto-scaling' },
    { icon: Workflow, name: 'Apache Kafka', description: 'Event streaming and real-time data processing' },
    { icon: Database, name: 'CockroachDB', description: 'Distributed SQL database with global consistency' },
    { icon: Cloud, name: 'Multi-Cloud', description: 'AWS, Azure, and GCP deployment options' },
    { icon: Zap, name: 'Edge Computing', description: 'Global CDN and edge processing capabilities' },
    { icon: Shield, name: 'Zero Trust', description: 'Advanced security with identity-based access' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
      <div className="max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Cloud-native Architecture
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Built for scalability, reliability, and performance. Our infrastructure automatically 
            adapts to your institution's needs, from 100 to 100,000+ users.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {technologies.map((tech, index) => (
            <div 
              key={index}
              className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl mr-4 group-hover:bg-blue-500/30 transition-colors">
                  <tech.icon className="h-6 w-6 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {tech.name}
                </h3>
              </div>
              <p className="text-blue-100 leading-relaxed">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Enterprise-Grade Performance
              </h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-green-300 font-bold text-lg">99.9%</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Uptime SLA</div>
                    <div className="text-blue-100 text-sm">Guaranteed availability with automatic failover</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-blue-300 font-bold text-lg">&lt;50ms</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Response Time</div>
                    <div className="text-blue-100 text-sm">Lightning-fast global performance</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-purple-300 font-bold text-lg">∞</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Auto-Scaling</div>
                    <div className="text-blue-100 text-sm">Seamlessly handle traffic spikes</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">Global Infrastructure</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-blue-100">
                    <div className="font-semibold text-white">50+ Data Centers</div>
                    <div>Worldwide coverage</div>
                  </div>
                  <div className="text-blue-100">
                    <div className="font-semibold text-white">Multi-Region</div>
                    <div>Disaster recovery</div>
                  </div>
                  <div className="text-blue-100">
                    <div className="font-semibold text-white">Edge Caching</div>
                    <div>Optimized delivery</div>
                  </div>
                  <div className="text-blue-100">
                    <div className="font-semibold text-white">Load Balancing</div>
                    <div>Intelligent routing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Architecture;