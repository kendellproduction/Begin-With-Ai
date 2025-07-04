import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer 
      className="py-8 relative overflow-hidden"
      style={{ backgroundColor: '#3b82f6' }}
    >
      {/* Moving Stars Background */}
      <div className="absolute inset-0 z-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * 200,
            }}
            animate={{
              x: [
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              ],
              y: [
                Math.random() * 200,
                Math.random() * 200,
                Math.random() * 200,
              ],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          >
            <div 
              className={`bg-white/80 rounded-full ${
                i % 10 === 0 ? 'w-2 h-2 animate-pulse' : 
                i % 6 === 0 ? 'w-1.5 h-1.5' : 'w-1 h-1'
              }`}
              style={{
                filter: `hue-rotate(${Math.random() * 60}deg)`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            ></div>
          </motion.div>
        ))}
      </div>

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