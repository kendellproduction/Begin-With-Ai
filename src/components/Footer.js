import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import OptimizedStarField from './OptimizedStarField';

const Footer = () => {
  return (
    <footer 
      className="py-8 relative overflow-hidden"
      style={{ backgroundColor: '#3b82f6' }}
    >
      <OptimizedStarField starCount={100} opacity={0.8} speed={0.6} size={1} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link to="/" className="text-xl font-bold text-white hover:text-gray-200 transition-colors duration-300">
              BeginningWithAI
            </Link>
            <p className="text-gray-200 text-sm mt-1">
              Master AI through hands-on learning
            </p>
          </div>

          {/* Essential Links */}
          <div className="flex items-center space-x-6 text-sm">
            <Link 
              to="/privacy" 
              className="text-gray-200 hover:text-white transition-colors duration-300"
            >
              Privacy
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-200 hover:text-white transition-colors duration-300"
            >
              Contact
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-gray-200 text-sm">
              © {new Date().getFullYear()} BeginningWithAI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 