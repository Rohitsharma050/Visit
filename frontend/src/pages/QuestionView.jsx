import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit, FiTrash2, FiCalendar } from 'react-icons/fi';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const QuestionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await api.get(`/questions/${id}`);
      setQuestion(response.data.data);
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await api.delete(`/questions/${id}`);
      navigate(`/subjects/${question.subjectId._id}`);
    } catch (error) {
      console.error('Error deleting question:', error);
      alert(error.response?.data?.message || 'Error deleting question');
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Question not found
          </h2>
          <Link to="/" className="btn btn-primary mt-4">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <Link
          to={`/subjects/${question.subjectId._id}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to {question.subjectId.title}
        </Link>

        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1 pr-4">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                {question.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className={`badge ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </span>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FiCalendar className="w-4 h-4 mr-1" />
                  {new Date(question.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Link
                to={`/questions/edit/${question._id}`}
                className="btn btn-outline flex items-center space-x-2"
              >
                <FiEdit className="w-4 h-4" />
                <span>Edit</span>
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-danger flex items-center space-x-2"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag, index) => (
                  <span key={index} className="tag text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Answer */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Answer
            </h3>
            <div 
              className="prose prose-lg dark:prose-invert max-w-none
                         prose-headings:text-gray-800 dark:prose-headings:text-gray-100
                         prose-p:text-gray-700 dark:prose-p:text-gray-300
                         prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                         prose-code:text-primary-600 dark:prose-code:text-primary-400
                         prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                         prose-a:text-primary-600 dark:prose-a:text-primary-400"
              dangerouslySetInnerHTML={{ __html: question.answer }}
            />
          </div>

          {/* Metadata Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {new Date(question.createdAt).toLocaleString()}
              </div>
              {question.updatedAt !== question.createdAt && (
                <div>
                  <span className="font-medium">Last updated:</span>{' '}
                  {new Date(question.updatedAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuestionView;
