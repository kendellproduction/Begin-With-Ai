import React from 'react';
import LoggedInNavbar from '../components/LoggedInNavbar';
import { motion } from 'framer-motion';

const AiNews = () => {
  // Mock data for AI news
  const aiNews = [
    {
      id: 1,
      title: "OpenAI Releases GPT-4 Turbo",
      summary: "The latest model offers improved performance and reduced costs for developers.",
      date: "2024-03-15"
    },
    {
      id: 2,
      title: "Google's Gemini Pro Now Available",
      summary: "Google's multimodal AI model is now accessible to developers worldwide.",
      date: "2024-03-10"
    },
    {
      id: 3,
      title: "AI in Healthcare: Breakthrough",
      summary: "New AI system can predict patient outcomes with 95% accuracy.",
      date: "2024-03-05"
    }
  ];

  // Mock data for user use cases
  const useCases = [
    {
      id: 1,
      username: "Sarah Chen",
      title: "Automating Customer Support",
      description: "I used GPT-4 to create an automated response system that reduced our support ticket resolution time by 60%."
    },
    {
      id: 2,
      username: "Michael Rodriguez",
      title: "Content Generation for Marketing",
      description: "Implemented Claude to generate SEO-optimized blog posts, increasing our organic traffic by 40%."
    },
    {
      id: 3,
      username: "Emma Thompson",
      title: "Data Analysis Automation",
      description: "Built a custom AI solution that processes and analyzes our sales data, saving 20 hours of manual work weekly."
    }
  ];

  return (
    <div 
      className="relative min-h-screen text-white overflow-hidden"
      style={{ backgroundColor: '#2061a6' }}
    >
      <LoggedInNavbar />

      {/* Star Animation Container for AiNews */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(140)].map((_, i) => {
          const screenH = window.innerHeight;
          const screenW = window.innerWidth;
          const initialY = Math.random() * screenH * 1.5 - screenH * 0.25;
          const targetY = Math.random() * screenH * 1.5 - screenH * 0.25;
          const initialX = Math.random() * screenW * 1.5 - screenW * 0.25;
          const targetX = Math.random() * screenW * 1.5 - screenW * 0.25;
          const starDuration = 30 + Math.random() * 25;
          const starSize = Math.random() * 3 + 1; // 1px to 4px

          return (
            <motion.div
              key={`ainews-star-${i}`}
              className="absolute rounded-full bg-white/50"
              style={{
                width: starSize,
                height: starSize,
              }}
              initial={{
                x: initialX,
                y: initialY,
                opacity: 0,
              }}
              animate={{
                x: targetX,
                y: targetY,
                opacity: [0, 0.6, 0.6, 0],
              }}
              transition={{
                duration: starDuration,
                repeat: Infinity,
                repeatDelay: Math.random() * 5 + 2,
                ease: "linear",
                opacity: {
                  duration: starDuration,
                  ease: "linear",
                  times: [0, 0.1, 0.85, 1],
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5 + 2,
                }
              }}
            />
          );
        })}
      </div>

      {/* Main content wrapper */}
      <div className="relative z-10">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">AI News & Community</h1>

          {/* AI News Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Latest AI Developments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiNews.map((news) => (
                <div
                  key={news.id}
                  className="bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <h3 className="text-xl font-semibold text-white mb-3">{news.title}</h3>
                  <p className="text-gray-400 mb-4">{news.summary}</p>
                  <p className="text-sm text-gray-500">{new Date(news.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </section>

          {/* User Use Cases Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Community Use Cases</h2>
            <div className="space-y-6">
              {useCases.map((useCase) => (
                <div
                  key={useCase.id}
                  className="bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      {useCase.username[0]}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-white">{useCase.username}</h3>
                      <h4 className="text-md font-medium text-indigo-400">{useCase.title}</h4>
                    </div>
                  </div>
                  <p className="text-gray-400">{useCase.description}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AiNews; 