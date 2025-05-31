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
      style={{ backgroundColor: '#2061a6' }}
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
              duration: 20 + Math.random() * 25,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              delay: Math.random() * 7
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
            <Link to="/about" className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-white/10">
              About
            </Link>
            <Link to="/features" className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-white/10">
              Features
            </Link>
            <Link to="/contact" className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-white/10">
              Contact
            </Link>
            {openAuthModal ? (
              <>
                <button onClick={() => handleAuthClick('login')} className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-white/10">
                  Login
                </button>
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="group relative bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity"></span>
                  <span className="relative">Start For Free</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-white/10">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="group relative bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity"></span>
                  <span className="relative">Start For Free</span>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-100 hover:text-white focus:outline-none focus:text-white p-2 rounded-md hover:bg-white/10 transition-all duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div 
        className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}
        style={{ backgroundColor: '#2061a6' }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/about"
            className="text-gray-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-all duration-300"
          >
            About
          </Link>
          <Link
            to="/features"
            className="text-gray-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-all duration-300"
          >
            Features
          </Link>
          <Link
            to="/contact"
            className="text-gray-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-all duration-300"
          >
            Contact
          </Link>
          {openAuthModal ? (
            <>
              <button
                onClick={() => handleAuthClick('login')}
                className="text-gray-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-all duration-300 w-full text-left"
              >
                Login
              </button>
              <button
                onClick={() => handleAuthClick('signup')}
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white block px-3 py-2 rounded-md text-base font-bold mx-3 mt-4 text-center hover:from-pink-600 hover:to-orange-600 transition-all duration-300 w-auto"
              >
                Start For Free
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white block px-3 py-2 rounded-md text-base font-bold mx-3 mt-4 text-center hover:from-pink-600 hover:to-orange-600 transition-all duration-300"
              >
                Start For Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 