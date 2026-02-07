import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      style={{ opacity: navOpacity }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center"
            >
              <span className="text-black font-bold text-xl">V</span>
            </motion.div>
            <span className="text-white font-bold text-2xl tracking-tight group-hover:text-gray-300 transition-colors">
              Visit
            </span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/guide"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Guide
            </Link>
            <Link
              to="/pricing"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Pricing
            </Link>
            <Link
              to="/support"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Support
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-white hover:text-gray-300 transition-colors text-sm font-medium px-4 py-2"
              >
                Login
              </motion.button>
            </Link>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
