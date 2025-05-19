import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';

const HomePage = () => {
  // AI facts and quotes
  const aiFacts = [
    "AI will add $15.7 trillion to the global economy by 2030.",
    "The first neural network was created in 1958.",
    "Prompt writing is the new coding.",
    "You don't need to be technical to use AI — you just need curiosity."
  ];

  const [currentFact, setCurrentFact] = useState('');

  useEffect(() => {
    // Set initial fact
    setCurrentFact(aiFacts[Math.floor(Math.random() * aiFacts.length)]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <LoggedInNavbar />
      <main className="max-w-full mx-auto">
        {/* Video Section */}
        <section className="relative w-full h-[70vh] mb-12 overflow-hidden shadow-[0_10px_30px_rgba(99,102,241,0.3)]">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/HomePageHeroVideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 flex flex-col items-center justify-center text-center p-4 backdrop-blur-[2px]">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              AI is changing everything. Let's help you master it.
            </h1>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <Link
                to="/lessons"
                className="relative block bg-gray-800/80 backdrop-blur-sm text-white text-xl font-bold px-8 py-4 rounded-3xl border border-gray-700/50 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-700/80 hover:border-indigo-500/50"
              >
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-purple-300 transition-all duration-300">
                  Start Your First Lesson
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* AI Fact/Quote Section */}
        <section className="max-w-3xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 shadow-lg">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-300 mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  AI Fact of the Day
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                  "{currentFact}"
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
