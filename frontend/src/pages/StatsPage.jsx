import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const StatsPage = () => {
  const [userCount, setUserCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/auth/stats');
        setUserCount(response.data.data.totalUsers);
      } catch (err) {
        setError('Failed to load stats');
        console.error('Stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {/* Logo */}
        <Link to="/" className="inline-flex items-center justify-center mb-12">
          <div className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center border-2 border-black dark:border-white">
            <span className="text-white dark:text-black font-bold text-2xl">V</span>
          </div>
        </Link>

        {/* Stats Display */}
        <div className="mb-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-widest mb-2">
            Total Users on Visit
          </p>
          
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 dark:text-red-400">{error}</p>
          ) : (
            <motion.h1
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="text-7xl md:text-9xl font-bold text-black dark:text-white"
            >
              {userCount?.toLocaleString()}
            </motion.h1>
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <span>Join them</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <Link 
          to="/" 
          className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 text-sm transition-colors"
        >
          ← Back to Visit
        </Link>
      </div>
    </div>
  );
};

export default StatsPage;
