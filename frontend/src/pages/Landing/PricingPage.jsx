import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiZap, FiStar } from 'react-icons/fi';
import Navbar from './Navbar';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Up to 3 subjects',
        'Basic notes storage',
        '5 AI formatting uses/month',
        'Standard code formatting',
        'Community support',
      ],
      limitations: [
        'Limited export options',
        'No priority support',
      ],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Pro',
      description: 'For serious learners',
      monthlyPrice: 9,
      annualPrice: 7,
      features: [
        'Unlimited subjects',
        'Unlimited notes storage',
        'Unlimited AI formatting',
        'Advanced code beautification',
        'Table & highlight formatting',
        'Priority support',
        'PDF export',
        'Search across all notes',
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'Lifetime',
      description: 'One-time payment, forever access',
      monthlyPrice: 149,
      annualPrice: 149,
      isLifetime: true,
      features: [
        'Everything in Pro',
        'Priority AI processing',
        'Early access to new features',
        'Lifetime updates',
        'Exclusive Discord community',
        'Direct feature requests',
      ],
      limitations: [],
      cta: 'Get Lifetime Access',
      popular: false,
    },
  ];

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-400 text-sm mb-8">
              Simple Pricing
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
              Start free, upgrade when you need more. No hidden fees, no surprises.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative w-16 h-8 bg-white/10 rounded-full p-1 transition-colors"
              >
                <motion.div
                  animate={{ x: isAnnual ? 32 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-6 h-6 bg-white rounded-full"
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-gray-500'}`}>
                Annual
              </span>
              {isAnnual && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                  Save 20%
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`relative group ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full flex items-center space-x-1">
                      <FiStar className="w-3 h-3" />
                      <span>RECOMMENDED</span>
                    </span>
                  </div>
                )}
                <div
                  className={`h-full p-8 rounded-2xl border transition-all ${
                    plan.popular
                      ? 'bg-white/[0.05] border-white/20 hover:border-white/40 shadow-[0_0_60px_rgba(255,255,255,0.1)]'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-500 text-sm">{plan.description}</p>
                  </div>

                  <div className="mb-8">
                    {plan.isLifetime ? (
                      <div className="flex items-baseline">
                        <span className="text-5xl font-black text-white">${plan.monthlyPrice}</span>
                        <span className="text-gray-500 ml-2">one-time</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline">
                        <span className="text-5xl font-black text-white">
                          ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-gray-500 ml-2">/month</span>
                      </div>
                    )}
                    {isAnnual && !plan.isLifetime && plan.monthlyPrice > 0 && (
                      <p className="text-gray-600 text-sm mt-2">
                        Billed annually (${plan.annualPrice * 12}/year)
                      </p>
                    )}
                  </div>

                  <Link to="/signup">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${
                        plan.popular
                          ? 'bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {plan.cta}
                    </motion.button>
                  </Link>

                  <div className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start space-x-3">
                        <FiCheck className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation) => (
                      <div key={limitation} className="flex items-start space-x-3 opacity-50">
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 h-0.5 bg-gray-500 rounded" />
                        </div>
                        <span className="text-gray-500 text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Trusted by students worldwide
            </h2>
            <div className="grid grid-cols-3 gap-8">
              {[
                { value: '10K+', label: 'Active Users' },
                { value: '1M+', label: 'Notes Created' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 px-6 lg:px-8 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Questions?
            </h2>
            <p className="text-gray-400 mb-8">
              Check our support page for answers to common questions.
            </p>
            <Link to="/support">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-all"
              >
                Visit Support Center
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold">V</span>
            </div>
            <span className="text-white font-bold text-xl">Visit</span>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
          </div>
          <div className="text-gray-600 text-sm">
            © 2026 Visit
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
