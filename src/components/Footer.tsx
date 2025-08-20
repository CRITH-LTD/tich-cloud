import React from 'react';
import { Cloud, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router';

const Footer = () => {
  const footerLinks = {
    Platform: ['Services', 'Pricing', 'Console', 'API Reference', 'Status'],
    Solutions: ['Universities', 'K-12 Schools', 'Government', 'Multi-Campus', 'International'],
    Resources: ['Documentation', 'Tutorials', 'Community', 'Support', 'Blog'],
    Company: ['About', 'Careers', 'Press', 'Partners', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Data Processing', 'GDPR', 'Security']
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Cloud className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">TICH</span>
              <span className="text-sm text-gray-400 font-medium">Education Cloud</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Cloud infrastructure platform designed specifically for educational institutions. 
              Build, scale, and manage your university in the cloud with enterprise-grade reliability.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Github className="h-6 w-6" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Mail className="h-6 w-6" />
              </Link>
            </div>
          </div>
          
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TICH Education Cloud. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Built for educators, by educators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;