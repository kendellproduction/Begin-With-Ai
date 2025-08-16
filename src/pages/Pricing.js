import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoggedInNavbar from '../components/LoggedInNavbar';
import { motion } from 'framer-motion';
import OptimizedStarField from '../components/OptimizedStarField';

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const plans = [
    {
      id: 'free',
      name: 'Free Tier',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with AI',
      features: [
        'Access to all beginner lessons',
        'Basic AI concepts and fundamentals',
        'Community support',
        'Progress tracking',
        'Basic quizzes'
      ],
      limitations: [
        'No intermediate or advanced lessons',
        'No interactive coding sandboxes',
        'No AI-powered feedback'
      ],
      buttonText: 'Current Plan',
      buttonStyle: 'bg-gray-600 cursor-not-allowed',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$10',
      period: 'month',
      description: 'Unlock your full AI learning potential',
      features: [
        'Everything in Free Tier',
        'Access to ALL intermediate & advanced lessons',
        'Interactive coding sandboxes',
        'AI-powered feedback and guidance',
        'Priority support',
        'Advanced project tutorials',
        'Real-world AI applications',
        'Certificate of completion'
      ],
      limitations: [],
      buttonText: 'Upgrade to Premium',
      buttonStyle: 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400',
      popular: true
    }
  ];

  const handlePlanSelect = (planId) => {
    if (planId === 'free') return; // Already on free plan
    
    // Here you would integrate with Stripe or your payment processor
    // For now, just show a message
    alert('Payment integration coming soon! You\'ll be able to upgrade to premium shortly.');
  };

  return (
    <div 
      className="relative min-h-screen text-white overflow-hidden"
      style={{ backgroundColor: '#3b82f6' }}
    >
      <LoggedInNavbar />

      {/* Optimized Star Field */}
      <OptimizedStarField starCount={220} opacity={0.8} speed={1} size={1.2} />

      {/* Main content wrapper */}
      <div className="relative z-10">
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Choose Your Learning Path
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Start with our free tier or unlock advanced AI lessons with Premium. 
                No hidden fees, cancel anytime.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`
                    relative flex flex-col
                    bg-gradient-to-br 
                    ${plan.popular 
                      ? 'from-slate-700/80 via-yellow-900/30 to-slate-800/80'
                      : 'from-slate-800/90 to-slate-900/90'
                    }
                    backdrop-blur-xl rounded-3xl p-8 border transition-all duration-300
                    min-h-[700px]
                    ${plan.popular 
                      ? 'border-yellow-400/70 ring-2 ring-yellow-500/30 shadow-2xl shadow-yellow-500/10'
                      : 'border-white/20 hover:border-white/30 hover:shadow-xl'
                    }
                  `}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className={`text-3xl font-bold mb-2 ${plan.popular ? 'text-yellow-400' : 'text-white'}`}>{plan.name}</h3>
                    <div className="mb-4">
                      <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-white'}`}>{plan.price}</span>
                      {plan.period !== 'forever' && (
                        <span className="text-gray-400 text-lg">/{plan.period}</span>
                      )}
                    </div>
                    <p className="text-gray-300 text-md">{plan.description}</p>
                  </div>

                  {/* Features & Limitations Wrapper - This will grow */}
                  <div className="flex-grow mb-8">
                    <div className="mb-6">
                      <h4 className={`text-lg font-semibold mb-4 ${plan.popular ? 'text-yellow-300' : 'text-white'}`}>What's included:</h4>
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <span className={`text-green-400 text-xl mt-1 ${plan.popular ? 'text-green-300' : 'text-green-400'}`}>✓</span>
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Limitations (for free plan, or could be an empty div for premium for structure) */}
                    {plan.limitations.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-400 mb-4">Limitations:</h4>
                        <ul className="space-y-3">
                          {plan.limitations.map((limitation, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <span className="text-red-400 text-xl mt-1">✗</span>
                              <span className="text-gray-400">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Placeholder for limitations on premium to maintain height, if needed, or adjust min-height of parent */}
                    {plan.id === 'premium' && plan.limitations.length === 0 && (
                      <div className="mb-6 min-h-[100px]">
                        
                      </div>
                    )}
                  </div>

                  {/* Action Button - Stays at the bottom due to flex-col and flex-grow above */}
                  <button
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={plan.id === 'free' && user?.subscriptionTier !== 'premium'}
                    className={`
                      w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 text-lg
                      transform hover:scale-[1.03] active:scale-[0.98] shadow-md hover:shadow-lg
                      ${(plan.id === 'free' && user?.subscriptionTier !== 'premium') 
                          ? 'bg-slate-600 cursor-default opacity-80' 
                          : plan.buttonStyle + ' text-slate-900 font-bold'
                      }
                      ${plan.popular ? 'hover:shadow-yellow-500/30' : 'hover:shadow-indigo-500/30'}
                    `}
                  >
                    {plan.id === 'free' && user?.subscriptionTier !== 'premium' ? 'Current Plan' : plan.buttonText}
                  </button>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="mt-20 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white text-center mb-12">
                Frequently Asked Questions
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Can I cancel anytime?
                  </h3>
                  <p className="text-gray-300">
                    Yes! You can cancel your premium subscription at any time. You'll continue to have access until the end of your billing period.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-gray-300">
                    We accept all major credit cards and PayPal through our secure payment processor, Stripe.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Is there a free trial?
                  </h3>
                  <p className="text-gray-300">
                    Our free tier gives you access to all beginner content permanently. You can upgrade to premium anytime to unlock advanced features.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Do you offer student discounts?
                  </h3>
                  <p className="text-gray-300">
                    Yes! Contact our support team with your student ID for a special discount on premium plans.
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Lessons */}
            <div className="text-center mt-16">
              <button
                onClick={() => navigate('/lessons')}
                className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
              >
                <span>←</span>
                <span>Back to Lessons</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 