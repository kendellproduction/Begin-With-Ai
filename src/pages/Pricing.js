import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoggedInNavbar from '../components/LoggedInNavbar';

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
      price: '$19',
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
    console.log('Upgrading to:', planId);
    // For now, just show a message
    alert('Payment integration coming soon! You\'ll be able to upgrade to premium shortly.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <LoggedInNavbar />
      
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
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`
                  relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 
                  backdrop-blur-xl rounded-3xl p-8 border transition-all duration-300
                  ${plan.popular 
                    ? 'border-yellow-400/50 ring-2 ring-yellow-400/20 scale-105' 
                    : 'border-white/20 hover:border-white/30'
                  }
                `}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period !== 'forever' && (
                      <span className="text-gray-400">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-300">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-white mb-4">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <span className="text-green-400 text-xl">✓</span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations (for free plan) */}
                {plan.limitations.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-400 mb-4">Limitations:</h4>
                    <ul className="space-y-3">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <span className="text-red-400 text-xl">✗</span>
                          <span className="text-gray-400">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={plan.id === 'free'}
                  className={`
                    w-full py-4 rounded-xl font-semibold text-white transition-all duration-300
                    transform hover:scale-105 active:scale-95
                    ${plan.buttonStyle}
                  `}
                >
                  {plan.buttonText}
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
  );
};

export default Pricing; 