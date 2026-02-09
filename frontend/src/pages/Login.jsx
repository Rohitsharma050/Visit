import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setFormData({ email: '', password: '' });
    }
    
    setLoading(false);
  };

  const handleGoogleSuccess = async (googleData) => {
    setError('');
    setGoogleLoading(true);

    const result = await googleLogin(googleData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setGoogleLoading(false);
  };

  const handleGoogleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className=" flex flex-col items-center justify-center  text-center mb-8">
          <Link to="/" className="flex items-center py-8 space-x-2">
            <div className="w-10 h-10 bg-black items-center justify-center dark:bg-white rounded-lg flex items-center justify-center border-2 border-black dark:border-white">
              <span className="text-white dark:text-black font-bold text-xl">V</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to access your question bank
          </p>
        </div>

        <div className="card">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Google Login Button - Above the form */}
          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={loading || googleLoading}
          />

          {/* OR Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-black text-gray-500 dark:text-gray-400">
                OR
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4"   autoComplete="off">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input pl-10"
                  placeholder="you@example.com"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input pl-10"
                  placeholder="••••••••"
                  autoComplete="off"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

