import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTAFooter = () => {
  return (
    <footer className="relative bg-black py-32 px-6 lg:px-8 overflow-hidden">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-12 tracking-tight leading-none">
            Start today
          </h2>

          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-12 py-5 bg-white text-black text-lg font-bold rounded-full overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10">Create Your First Subject</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="border-t border-white/10 pt-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">V</span>
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">
                Visit
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center space-x-8">
              <Link
                to="/login"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Sign Up
              </Link>
              <a
                href="#product"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Product
              </a>
            </div>

            {/* Copyright */}
            <div className="text-gray-600 text-sm">
              © 2026 Visit. Organize your knowledge.
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default CTAFooter;
