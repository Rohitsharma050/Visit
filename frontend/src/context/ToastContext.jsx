import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast types configuration
const toastConfig = {
  success: {
    icon: FiCheck,
    bgColor: 'bg-black dark:bg-white',
    textColor: 'text-white dark:text-black',
    iconBg: 'bg-green-500',
  },
  error: {
    icon: FiX,
    bgColor: 'bg-black dark:bg-white',
    textColor: 'text-white dark:text-black',
    iconBg: 'bg-red-500',
  },
  warning: {
    icon: FiAlertCircle,
    bgColor: 'bg-black dark:bg-white',
    textColor: 'text-white dark:text-black',
    iconBg: 'bg-yellow-500',
  },
  info: {
    icon: FiInfo,
    bgColor: 'bg-black dark:bg-white',
    textColor: 'text-white dark:text-black',
    iconBg: 'bg-blue-500',
  },
};

// Individual Toast Component
const Toast = ({ id, message, type = 'info', onClose }) => {
  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        ${config.bgColor} ${config.textColor}
        border border-gray-200 dark:border-gray-800
        min-w-[300px] max-w-[400px]
      `}
    >
      <div className={`flex-shrink-0 w-6 h-6 rounded-full ${config.iconBg} flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 rounded hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
      >
        <FiX className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Convenience methods
  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastContext;
