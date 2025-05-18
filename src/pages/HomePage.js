import React from 'react';
import { Link } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';

const HomePage = () => {
  // Latest AI news for the homepage card
  const latestNews = {
    title: "OpenAI Releases GPT-4 Turbo",
    summary: "The latest model offers improved performance and reduced costs for developers.",
    date: "2024-03-15"
  };

  // Feature cards data
  const featureCards = [
    {
      title: "Dashboard",
      subtitle: "Track your progress",
      route: "/dashboard",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Lessons",
      subtitle: "Start learning AI",
      route: "/lessons",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "AI News",
      subtitle: "Latest developments",
      route: "/ai-news",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  // Haptic feedback function
  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      // Trigger a short vibration (50ms)
      navigator.vibrate(50);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <LoggedInNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to BeginningWithAI</h1>
          <p className="text-xl text-gray-300">Your journey to mastering AI starts here</p>
        </section>

        {/* Feature Cards Row */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featureCards.map((card) => (
              <Link
                key={card.title}
                to={card.route}
                onClick={triggerHapticFeedback}
                className="relative h-56 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 cursor-pointer group active:scale-95"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 group-hover:from-black/50 group-hover:to-black/30 transition-all duration-300 flex flex-col justify-center items-center text-white">
                  <h2 className="text-2xl font-bold mb-2 transform group-hover:scale-110 transition-transform duration-300">{card.title}</h2>
                  <p className="text-sm font-medium transform group-hover:scale-105 transition-transform duration-300">{card.subtitle}</p>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-xl transition-all duration-300" />
              </Link>
            ))}
          </div>
        </section>

        {/* Latest AI News Card */}
        <section className="mb-12">
          <div className="bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">Latest AI News</h2>
              <Link 
                to="/ai-news" 
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
              >
                View All News →
              </Link>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-xl font-semibold text-white mb-3">{latestNews.title}</h3>
              <p className="text-gray-400 mb-4">{latestNews.summary}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{new Date(latestNews.date).toLocaleDateString()}</p>
                <Link 
                  to="/ai-news" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
