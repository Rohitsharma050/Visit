import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiBook, FiEdit, FiTrash2 } from 'react-icons/fi';

const SubjectCard = ({ subject, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="card card-hover cursor-pointer"
    >
      <Link to={`/subjects/${subject._id}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-black dark:bg-white rounded-lg border-2 border-black dark:border-white">
              <FiBook className="w-6 h-6 text-white dark:text-black" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {subject.title}
              </h3>
              {subject.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {subject.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {subject.questionCount || 0} question{subject.questionCount !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-2" onClick={(e) => e.preventDefault()}>
            <button
              onClick={() => onDelete(subject._id)}
              className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors border-2 border-transparent hover:border-black dark:hover:border-white"
              aria-label="Delete subject"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SubjectCard;
