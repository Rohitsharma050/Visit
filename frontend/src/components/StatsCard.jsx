import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color = 'primary' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
        {Icon && (
          <div className="p-4 bg-black dark:bg-white rounded-xl border-2 border-black dark:border-white">
            <Icon className="w-8 h-8 text-white dark:text-black" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
