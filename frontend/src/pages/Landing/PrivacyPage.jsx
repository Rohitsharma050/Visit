import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const PrivacyPage = () => {
  const sections = [
    {
      title: 'Introduction',
      content: `At Visit, we take your privacy seriously. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our Service.

By using Visit, you agree to the collection and use of information as described in this policy. If you disagree with any part of this policy, please discontinue use of our Service.`,
    },
    {
      title: 'Information We Collect',
      content: `We collect information in the following ways:

**Account Information**
When you create an account, we collect:
• Your name and email address
• Account credentials (encrypted password)
• Profile preferences

**Content You Create**
• Questions and answers you store in Visit
• Subject and topic organization
• Tags and difficulty ratings
• Any notes or materials you upload

**Usage Information**
• How you interact with the Service
• Features you use and frequency
• Device and browser information
• IP address and general location

**Cookies and Similar Technologies**
We use cookies to maintain your session, remember preferences, and improve the Service experience.`,
    },
    {
      title: 'How We Use Your Information',
      content: `We use your information to:

• Provide and maintain the Service
• Process and store your study notes securely
• Send important service notifications
• Improve and optimize the user experience
• Provide customer support
• Analyze usage patterns to enhance features
• Comply with legal obligations

We do NOT use your content for:
• Advertising or marketing to third parties
• Training AI models (your notes remain private)
• Selling to data brokers`,
    },
    {
      title: 'Your Notes and Content Privacy',
      content: `Your study notes are private to you. Here's how we protect them:

**Storage Security**
• All content is stored on secure, encrypted servers
• Database access is strictly controlled
• Regular security audits are performed

**Access Control**
• Only you can access your notes (via your account)
• Our staff cannot view your content unless required for support with your explicit permission
• No automated content scanning for advertising purposes

**AI Formatting**
When you use the Code Formatting feature:
• Your content is sent securely to our AI processing
• Content is processed and returned immediately
• We do not store AI processing logs
• Your content is not used to train AI models`,
    },
    {
      title: 'Data Retention',
      content: `We retain your data as follows:

**Active Accounts**
• Your content is stored for as long as your account is active
• You can delete individual items at any time

**Deleted Content**
• Content you delete is removed from our servers within 30 days
• Some anonymized usage data may be retained for analytics

**Account Deletion**
• You may request full account deletion at any time
• All your data will be permanently deleted within 30 days of the request
• We will confirm deletion via email`,
    },
    {
      title: 'Third-Party Services',
      content: `We use limited third-party services to operate Visit:

**Hosting & Infrastructure**
Cloud hosting providers for reliable service delivery. They do not have access to your content.

**Authentication**
Secure authentication services to protect your account access.

**AI Processing**
Google Gemini API for code formatting features. Content is processed in real-time and not stored by the provider for training.

**Analytics**
Anonymous usage analytics to improve the Service. No personal content is shared.

We carefully vet all third-party providers and require them to maintain appropriate security standards.`,
    },
    {
      title: 'Cookies Policy',
      content: `We use cookies for:

**Essential Cookies**
Required for the Service to function (authentication, security).

**Preference Cookies**
Remember your settings (theme, display preferences).

**Analytics Cookies**
Help us understand how users interact with the Service.

You can manage cookies through your browser settings. Note that disabling essential cookies may prevent the Service from functioning properly.`,
    },
    {
      title: 'Your Rights',
      content: `You have the right to:

• **Access** - Request a copy of your personal data
• **Correction** - Update or correct your information
• **Deletion** - Request deletion of your account and data
• **Export** - Download your notes and content
• **Opt-out** - Unsubscribe from marketing emails

To exercise these rights, contact us at privacy@visit.app.`,
    },
    {
      title: 'Security Measures',
      content: `We implement industry-standard security measures:

• HTTPS encryption for all data transmission
• Encrypted password storage (bcrypt hashing)
• Regular security updates and patches
• Access controls and monitoring
• Secure development practices

While we strive to protect your information, no method of transmission or storage is 100% secure. Please use strong, unique passwords and keep your login credentials safe.`,
    },
    {
      title: 'Children\'s Privacy',
      content: `Visit is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.`,
    },
    {
      title: 'Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through the Service.

The "Last updated" date at the top of this policy indicates when it was last revised. Your continued use of Visit after changes take effect constitutes acceptance of the updated policy.`,
    },
    {
      title: 'Contact Us',
      content: `If you have questions or concerns about this Privacy Policy or our data practices, please contact us:

**Email:** privacy@visit.app

**For Support Issues:** support@visit.app

We aim to respond to all privacy-related inquiries within 5 business days.`,
    },
  ];

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-gray-400 mb-4">
              Last updated: February 2026
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your privacy matters. This policy explains how Visit collects, uses, and protects your information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 px-6 lg:px-8 bg-white/[0.01] border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h3 className="text-sm font-medium text-gray-500 mb-4">Contents</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sections.map((section, index) => (
                <a
                  key={section.title}
                  href={`#section-${index}`}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-16">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                id={`section-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="scroll-mt-32"
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  {section.title}
                </h2>
                <div className="text-gray-400 leading-relaxed whitespace-pre-line prose-strong:text-white prose-strong:font-semibold">
                  {section.content.split('**').map((part, i) => 
                    i % 2 === 1 ? (
                      <strong key={i} className="text-white font-semibold">{part}</strong>
                    ) : (
                      part
                    )
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Back to Top */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-white/10"
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gray-500 hover:text-white transition-colors text-sm"
            >
              ↑ Back to top
            </button>
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
            <Link to="/privacy" className="text-white font-medium">Privacy</Link>
          </div>
          <div className="text-gray-600 text-sm">
            © 2026 Visit
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPage;
