import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = ({ openAuthModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarHeight = 64;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthClick = (mode) => {
    if (openAuthModal) {
      openAuthModal(mode);
    }
  };

  return (
    <nav 
      className="sticky top-0 z-50"
      style={{ backgroundColor: '#3b82f6' }}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`nav-star-${i}`}
            className="absolute bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * navbarHeight * 1.5 - (navbarHeight * 0.25),
              opacity: Math.random() * 0.5 + 0.4,
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * navbarHeight * 1.5 - (navbarHeight * 0.25),
                Math.random() * navbarHeight * 1.5 - (navbarHeight * 0.25),
              ],
              scale: [Math.random() * 1.2 + 0.6, Math.random() * 1.2 + 0.6, Math.random() * 1.2 + 0.6],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              delay: 0
            }}
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <span className="text-2xl font-bold text-white group-hover:text-gray-200 transition-all duration-300">
                BeginningWithAI
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-300"
            >
              About
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-300"
            >
              Pricing
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-300"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleAuthClick('login')}
              className="text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors duration-300"
            >
              Log In
            </button>
            <button
              onClick={() => handleAuthClick('signup')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-300 hover:text-white focus:outline-none focus:text-white transition-colors duration-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-500 bg-opacity-90 backdrop-blur-sm rounded-lg mt-2">
              <Link 
                to="/about" 
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/pricing" 
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <button
                onClick={() => {
                  handleAuthClick('login');
                  setIsMenuOpen(false);
                }}
                className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-300"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  handleAuthClick('signup');
                  setIsMenuOpen(false);
                }}
                className="bg-white text-blue-600 hover:bg-gray-100 block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 mt-2"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 