import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#3b82f6' }}>
      <Navbar />
      
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              className="text-center mb-16"
            >
              <div className="glass-hero rounded-3xl p-8 mb-8 mx-auto max-w-4xl">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  About <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">BeginningWithAI</span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                  We're on a mission to make artificial intelligence accessible to everyone, one learner at a time
                </p>
              </div>
            </div>

            {/* Mission Statement */}
            <section 
              className="mb-20"
            >
              <div className="glass-accent rounded-3xl p-8 md:p-12 text-center">
                <div className="text-6xl mb-6">🌟</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-cyan-100 leading-relaxed max-w-4xl mx-auto">
                  To democratize AI education and empower individuals from all backgrounds to harness the transformative power of artificial intelligence. We believe that AI literacy is not just the future - it's the present, and everyone deserves access to it.
                </p>
              </div>
            </section>

            {/* Our Story */}
            <section 
              className="mb-20"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Our <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Story</span>
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="glass-card rounded-2xl p-8">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-white mb-4">The Beginning</h3>
                  <p className="text-gray-200 leading-relaxed">
                    BeginningWithAI was born from a simple observation: while AI was transforming industries, 
                    learning about it remained intimidating and inaccessible. We set out to change that by creating 
                    a platform where anyone could start their AI journey, regardless of their technical background.
                  </p>
                </div>
                
                <div className="glass-card rounded-2xl p-8">
                  <div className="text-4xl mb-4">💡</div>
                  <h3 className="text-2xl font-bold text-white mb-4">The Vision</h3>
                  <p className="text-gray-200 leading-relaxed">
                    We envision a world where AI literacy is as common as digital literacy. Our platform combines 
                    cutting-edge technology with proven educational principles to make learning AI engaging, 
                    practical, and achievable for everyone.
                  </p>
                </div>
              </div>
            </section>

            {/* Core Values */}
            <section 
              className="mb-20"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Our <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Values</span>
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "🎯",
                    title: "Accessibility First",
                    description: "We believe AI education should be available to everyone, regardless of background or experience level."
                  },
                  {
                    icon: "🤝",
                    title: "Community Driven",
                    description: "Learning is better together. We foster a supportive community where learners help each other grow."
                  },
                  {
                    icon: "🔬",
                    title: "Practical Learning",
                    description: "Theory is important, but application is key. We focus on hands-on, real-world AI projects."
                  },
                  {
                    icon: "🌱",
                    title: "Continuous Growth",
                    description: "AI is evolving rapidly, and so are we. We're constantly updating our curriculum and approach."
                  },
                  {
                    icon: "🔒",
                    title: "Ethical AI",
                    description: "We emphasize responsible AI development and the importance of ethical considerations in AI applications."
                  },
                  {
                    icon: "✨",
                    title: "Innovation",
                    description: "We leverage the latest educational technologies to create the most effective learning experiences."
                  }
                ].map((value, index) => (
                  <div
                    key={index}
                    className="glass-surface rounded-2xl p-6 text-center"
                  >
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                    <p className="text-gray-200 leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Team Section */}
            <section 
              className="mb-20"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Meet Our <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Team</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  We're a diverse group of educators, engineers, and AI enthusiasts united by our passion for making AI accessible to all
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    name: "Dr. Sarah Kim",
                    role: "Founder & CEO",
                    bio: "Former AI researcher at Google with 10+ years in machine learning education",
                    icon: "👩‍🔬"
                  },
                  {
                    name: "Marcus Chen",
                    role: "Chief Technology Officer",
                    bio: "Full-stack developer passionate about creating intuitive learning platforms",
                    icon: "👨‍💻"
                  },
                  {
                    name: "Elena Rodriguez",
                    role: "Head of Curriculum",
                    bio: "Educational technology expert with a focus on adaptive learning systems",
                    icon: "👩‍🎓"
                  },
                  {
                    name: "David Park",
                    role: "Lead AI Engineer",
                    bio: "Specializes in developing AI-powered educational tools and feedback systems",
                    icon: "🤖"
                  },
                  {
                    name: "Lisa Thompson",
                    role: "Community Manager",
                    bio: "Dedicated to fostering an inclusive and supportive learning community",
                    icon: "👥"
                  },
                  {
                    name: "Alex Johnson",
                    role: "UX Designer",
                    bio: "Creates intuitive interfaces that make complex AI concepts accessible to everyone",
                    icon: "🎨"
                  }
                ].map((member, index) => (
                  <div
                    key={index}
                    className="glass-secondary rounded-2xl p-6 text-center"
                  >
                    <div className="text-5xl mb-4">{member.icon}</div>
                    <div className="glass-surface rounded-lg p-4 mb-4">
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                      <p className="text-cyan-300 font-semibold">{member.role}</p>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Impact Stats */}
            <section 
              className="mb-20"
            >
              <div className="glass-primary rounded-3xl p-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Our Impact
                </h2>
                <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
                  Every day, we help more people discover the power of AI
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { number: "10,000+", label: "Students Taught", icon: "🎓" },
                    { number: "50+", label: "AI Lessons", icon: "📚" },
                    { number: "95%", label: "Success Rate", icon: "🏆" },
                    { number: "24/7", label: "AI Support", icon: "🤖" }
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="glass-surface rounded-2xl p-6"
                    >
                      <div className="text-4xl mb-2">{stat.icon}</div>
                      <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section 
              className="text-center"
            >
              <div className="glass-accent rounded-3xl p-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Join Our Mission
                </h2>
                <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
                  Ready to be part of the AI revolution? Start your journey with us today
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => navigate('/signup')}
                    className="glass-button bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-full text-lg"
                  >
                    🚀 Start Learning
                  </button>
                  <button 
                    onClick={() => navigate('/contact')}
                    className="glass-secondary border-2 border-white/20 hover:border-white/40 text-white font-semibold py-4 px-8 rounded-full text-lg"
                  >
                    💬 Get in Touch
                  </button>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About; 