import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiMail, FiMessageCircle, FiHelpCircle } from 'react-icons/fi';
import Navbar from './Navbar';

const SupportPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: 'bug',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      question: 'How do I store my study notes?',
      answer: 'Create a subject from your dashboard, then add questions with detailed answers using our rich text editor. You can format text, add code blocks, lists, and more. All content is automatically saved to your account.',
    },
    {
      question: 'Does AI formatting reduce or summarize my content?',
      answer: 'No. Our Code Formatting feature is specifically designed to preserve ALL your content. It only formats code blocks with proper indentation and structure while leaving all other content (headings, paragraphs, lists) exactly as you wrote them.',
    },
    {
      question: 'How do I format only code blocks?',
      answer: 'In the question editor, click the "Code Formatting" button. This uses AI to detect and beautify code snippets in your content—adding proper indentation, line breaks, and syntax structure—without modifying any other text.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. All your notes are stored securely with encrypted connections. We never share your content with third parties. Your study materials remain private and accessible only to you.',
    },
    {
      question: 'Can I export my notes?',
      answer: 'Yes. You can export entire subjects to PDF format for offline studying. Go to any subject page and click the "Export PDF" button to download all questions and answers.',
    },
    {
      question: 'What happens if I exceed the free plan limits?',
      answer: 'You\'ll be notified when approaching limits. Your existing content remains safe and accessible. To add more subjects or use unlimited AI formatting, upgrade to the Pro plan.',
    },
    {
      question: 'Can I organize questions by difficulty?',
      answer: 'Yes. Each question can be tagged with Easy, Medium, or Hard difficulty. Use the filter panel on any subject page to view questions by difficulty level for focused revision.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', issueType: 'bug', description: '' });
      setSubmitted(false);
    }, 3000);
  };

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
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <FiHelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Need Help?
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We've got you covered. Find answers to common questions or reach out to our team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500">Quick answers to common questions about Visit.</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-white font-medium pr-8">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5 text-gray-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FiMessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
              <p className="text-gray-500">Send us a message and we'll get back to you shortly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Issue Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { value: 'bug', label: 'Bug Report' },
                    { value: 'feature', label: 'Feature Request' },
                    { value: 'other', label: 'Other' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, issueType: type.value })}
                      className={`py-3 px-4 rounded-xl border transition-all ${
                        formData.issueType === type.value
                          ? 'bg-white text-black border-white'
                          : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors resize-none"
                  placeholder="Please describe your issue or request in detail..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitted}
                className={`w-full py-4 rounded-xl font-semibold transition-all ${
                  submitted
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                }`}
              >
                {submitted ? '✓ Message Sent!' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-6 lg:px-8 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 border border-white/10 rounded-2xl hover:border-white/20 transition-colors"
            >
              <FiMail className="w-8 h-8 text-white mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Email Support</h3>
              <p className="text-gray-500 text-sm mb-4">
                Reach our team directly for complex issues.
              </p>
              <a href="mailto:support@visit.app" className="text-white text-sm font-medium hover:underline">
                support@visit.app
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 border border-white/10 rounded-2xl hover:border-white/20 transition-colors"
            >
              <FiHelpCircle className="w-8 h-8 text-white mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Product Guide</h3>
              <p className="text-gray-500 text-sm mb-4">
                Learn how to use all of Visit's features.
              </p>
              <Link to="/guide" className="text-white text-sm font-medium hover:underline">
                Read the Guide →
              </Link>
            </motion.div>
          </div>
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

export default SupportPage;
