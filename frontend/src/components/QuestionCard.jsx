import { motion } from 'framer-motion';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const QuestionCard = ({ question, onDelete }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'badge-easy';
      case 'Medium':
        return 'badge-medium';
      case 'Hard':
        return 'badge-hard';
      default:
        return 'badge-easy';
    }
  };

  // Strip HTML for preview
  const getTextPreview = (html) => {
    const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-xl transition-all"
    >
      <Link to={`/questions/view/${question._id}`} className="block">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex-1 pr-4 hover:text-black dark:hover:text-white transition-colors">
            {question.title}
          </h3>
          <span className={`badge ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {getTextPreview(question.answer)}
        </p>

        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {question.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(question.createdAt).toLocaleDateString()}
        </span>

        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <Link
            to={`/questions/edit/${question._id}`}
            className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors border-2 border-transparent hover:border-gray-900 dark:hover:border-gray-100"
          >
            <FiEdit className="w-4 h-4" />
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(question._id);
            }}
            className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors border-2 border-transparent hover:border-gray-900 dark:hover:border-gray-100"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
