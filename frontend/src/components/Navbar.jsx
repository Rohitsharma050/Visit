import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-black shadow-lg border-b border-gray-900 dark:border-gray-100"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center border-2 border-black dark:border-white">
              <span className="text-white dark:text-black font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-bold text-black dark:text-white">
              Visit
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors border-2 border-gray-300 dark:border-gray-700"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FiSun className="w-5 h-5 text-white" />
              ) : (
                <FiMoon className="w-5 h-5 text-black" />
              )}
            </button>

            {/* User Info */}
            {user && (
              <>
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700">
                  <FiUser className="w-4 h-4 text-gray-900 dark:text-gray-100" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.name}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border-2 border-black dark:border-white"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
