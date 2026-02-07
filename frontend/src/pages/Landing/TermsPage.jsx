import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const TermsPage = () => {
  const sections = [
    {
      title: '1. Introduction',
      content: `Welcome to Visit ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our website and services (collectively, the "Service"). By accessing or using Visit, you agree to be bound by these Terms.

If you do not agree to these Terms, please do not use our Service. We reserve the right to update these Terms at any time, and your continued use of the Service constitutes acceptance of any changes.`,
    },
    {
      title: '2. User Responsibilities',
      content: `As a user of Visit, you agree to:

• Provide accurate and complete information when creating your account
• Maintain the security of your account credentials
• Use the Service only for lawful purposes
• Not attempt to gain unauthorized access to any part of the Service
• Not use the Service to store or distribute harmful, illegal, or offensive content
• Not interfere with or disrupt the Service or its servers
• Comply with all applicable laws and regulations

You are solely responsible for all content you store and create within Visit.`,
    },
    {
      title: '3. Content Ownership',
      content: `You retain full ownership of all content you create and store within Visit. This includes questions, answers, notes, and any other materials you upload or enter.

By using our Service, you grant us a limited license to store, process, and display your content solely for the purpose of providing the Service to you.

We do not claim any ownership rights over your content and will not use your content for any purpose other than operating and improving the Service.`,
    },
    {
      title: '4. Acceptable Use',
      content: `You agree not to use Visit for:

• Storing or distributing copyrighted material without authorization
• Sharing content that is defamatory, harassing, or threatening
• Distributing malware or malicious code
• Attempting to reverse engineer or hack the Service
• Creating accounts through automated means
• Impersonating others or misrepresenting your affiliation
• Any commercial purpose without our written consent
• Violating the rights of others

We reserve the right to remove content and suspend accounts that violate these guidelines.`,
    },
    {
      title: '5. Service Availability',
      content: `We strive to maintain high availability of our Service, but we do not guarantee uninterrupted access. The Service may be temporarily unavailable due to:

• Scheduled maintenance and updates
• Technical issues or server problems
• Factors outside our control

We will make reasonable efforts to notify users of planned maintenance in advance. We are not liable for any loss or damage resulting from Service interruptions.`,
    },
    {
      title: '6. Account Termination',
      content: `We may suspend or terminate your account if you:

• Violate these Terms or our policies
• Engage in fraudulent or illegal activities
• Abuse the Service or other users
• Fail to pay applicable fees (for paid plans)

You may terminate your account at any time by contacting us. Upon termination, your right to use the Service ceases, and we may delete your data after a reasonable retention period.`,
    },
    {
      title: '7. Limitation of Liability',
      content: `To the maximum extent permitted by law, Visit and its affiliates, officers, employees, and agents shall not be liable for:

• Any indirect, incidental, special, or consequential damages
• Loss of profits, data, or business opportunities
• Damages arising from your use or inability to use the Service
• Actions of third parties

Our total liability to you for any claims arising from your use of the Service shall not exceed the amount you paid us in the preceding 12 months.

The Service is provided "as is" without warranties of any kind, express or implied.`,
    },
    {
      title: '8. Privacy',
      content: `Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy. By using Visit, you consent to our data practices as described in the Privacy Policy.

We do not sell your personal information to third parties.`,
    },
    {
      title: '9. Changes to Terms',
      content: `We may modify these Terms at any time. We will notify users of significant changes via email or through the Service. Your continued use after changes take effect constitutes acceptance of the new Terms.

We encourage you to review these Terms periodically for any updates.`,
    },
    {
      title: '10. Contact Information',
      content: `If you have questions about these Terms, please contact us at:

Email: legal@visit.app

We will respond to inquiries within a reasonable timeframe.`,
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
              Terms & Conditions
            </h1>
            <p className="text-gray-400">
              Last updated: February 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4">
                  {section.title}
                </h2>
                <div className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {section.content}
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

            <Link to="/terms" className="text-white font-medium">Terms</Link>
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

export default TermsPage;
