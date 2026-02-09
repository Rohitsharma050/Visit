import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

// Google Icon Component (colored version)
const GoogleIconColored = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const GoogleLoginButtonActive = ({ onSuccess, onError, disabled = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        
        if (!userInfoResponse.ok) {
          throw new Error('Failed to get user info from Google');
        }
        
        const userInfo = await userInfoResponse.json();
        
        // Call the parent's onSuccess with the Google token and user info
        await onSuccess({
          accessToken: tokenResponse.access_token,
          userInfo: {
            googleId: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name,
            profilePicture: userInfo.picture
          }
        });
      } catch (error) {
        console.error('Google login error:', error);
        onError?.(error.message || 'Google login failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      if (error.type === 'popup_closed') {
        onError?.('Sign-in popup was closed. Please try again.');
      } else {
        onError?.('Failed to authenticate with Google. Please try again.');
      }
    },
    flow: 'implicit'
  });

  const handleClick = () => {
    if (!isLoading && !disabled) {
      googleLogin();
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={isLoading || disabled}
      whileHover={{ scale: isLoading || disabled ? 1 : 1.01 }}
      whileTap={{ scale: isLoading || disabled ? 1 : 0.99 }}
      className={`
        w-full flex items-center justify-center gap-3 
        px-4 py-2 rounded-lg font-medium
        bg-white dark:bg-black
        border-2 border-gray-300 dark:border-gray-700
        text-gray-700 dark:text-gray-300
        hover:bg-gray-50 dark:hover:bg-gray-900
        hover:border-gray-400 dark:hover:border-gray-600
        focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300 rounded-full animate-spin" />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <GoogleIconColored />
          <span>Continue with Google</span>
        </>
      )}
    </motion.button>
  );
};

export default GoogleLoginButtonActive;
