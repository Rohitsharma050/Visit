import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen, FiCpu, FiCode, FiRefreshCw, FiArrowRight, FiCheck } from 'react-icons/fi';
import Navbar from './Navbar';

const GuidePage = () => {
  const features = [
    {
      icon: FiBookOpen,
      title: 'Question Bank',
      description: 'Organize questions by subject with searchable, filterable collections.',
    },
    {
      icon: FiCpu,
      title: 'AI Formatting',
      description: 'Intelligent formatting that preserves content while enhancing structure.',
    },
    {
      icon: FiCode,
      title: 'Code Structuring',
      description: 'Automatic code beautification with proper indentation and syntax.',
    },
    {
      icon: FiRefreshCw,
      title: 'Revision Optimization',
      description: 'Quick access to all your notes for efficient revision sessions.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Study from any source',
      description: 'Whether it\'s a textbook, online course, or tutorials - gather your learning materials.',
    },
    {
      number: '02',
      title: 'Store Q&A in Visit',
      description: 'Create questions and answers in our rich text editor with full formatting support.',
    },
    {
      number: '03',
      title: 'Structure by subject',
      description: 'Organize your knowledge into subjects for easy navigation and management.',
    },
    {
      number: '04',
      title: 'Revise faster',
      description: 'Access your structured notes anytime for quick, efficient revision.',
    },
  ];

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-400 text-sm mb-8">
              Product Guide
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Guide to Visit
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Learn how to transform scattered knowledge into structured, accessible study materials 
              that stay with you forever.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                The Problem with<br />
                <span className="text-gray-500">Scattered Knowledge</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Your study notes are everywhere—Google Docs, Notion, random text files, 
                screenshots, and bookmarks you'll never revisit. When exam time arrives, 
                you waste hours searching instead of studying.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Visit solves this by giving you one structured home for all your 
                question-answer pairs, organized by subject, formatted beautifully, 
                and always accessible.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
              <div className="relative bg-white/[0.02] border border-white/10 rounded-3xl p-8">
                <div className="space-y-4">
                  {['Scattered notes', 'Lost bookmarks', 'Unreadable handwriting', 'Forgotten sources'].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="flex items-center space-x-4 p-4 bg-red-500/5 border border-red-500/10 rounded-xl"
                    >
                      <div className="w-2 h-2 bg-red-500/50 rounded-full" />
                      <span className="text-gray-400">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-6 lg:px-8 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How Visit Works
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A simple four-step process to transform how you store and access knowledge.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-6 border border-white/10 rounded-2xl bg-white/[0.02] hover:border-white/20 transition-colors">
                  <span className="text-5xl font-black text-white/10 mb-4 block">
                    {step.number}
                  </span>
                  <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <FiArrowRight className="w-5 h-5 text-white/20" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Key Features
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to organize and access your study materials efficiently.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="p-8 border border-white/10 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent hover:border-white/20 transition-all"
              >
                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage Walkthrough */}
      <section className="py-24 px-6 lg:px-8 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How to Use Visit
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              'Create an account and log in to your dashboard',
              'Add subjects for each topic you\'re studying',
              'Create questions with detailed answers using the rich text editor',
              'Use Code Formatting to beautify any code snippets',
              'Tag questions by difficulty for focused revision',
              'Search and filter to find exactly what you need',
              'Export to PDF when you need offline access',
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-start space-x-4 p-5 border border-white/10 rounded-xl hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-bold text-sm">{index + 1}</span>
                </div>
                <p className="text-gray-300 text-lg pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to get started?
            </h2>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-white text-black font-bold rounded-full hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
              >
                Create Your Account
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
            <Link to="/guide" className="text-white font-medium">Guide</Link>
            <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link to="/support" className="text-gray-400 hover:text-white transition-colors">Support</Link>
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

export default GuidePage;
