import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import QuestionEditor from '../components/QuestionEditor';

const QuestionEdit = () => {
  const { id, subjectId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    answer: '',
    difficulty: 'Easy',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchQuestion();
    } else if (subjectId) {
      fetchSubject();
    }
  }, [id, subjectId]);

  const fetchQuestion = async () => {
    try {
      const response = await api.get(`/questions/${id}`);
      const question = response.data.data;
      setFormData({
        title: question.title,
        answer: question.answer,
        difficulty: question.difficulty,
        tags: question.tags
      });
      setSubject(question.subjectId);
    } catch (error) {
      console.error('Error fetching question:', error);
      alert('Error loading question');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubject = async () => {
    try {
      const response = await api.get(`/subjects/${subjectId}`);
      setSubject(response.data.data);
    } catch (error) {
      console.error('Error fetching subject:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditMode) {
        await api.put(`/questions/${id}`, formData);
      } else {
        await api.post('/questions', {
          ...formData,
          subjectId: subjectId
        });
      }
      
      navigate(`/subjects/${subjectId || subject._id}`);
    } catch (error) {
      console.error('Error saving question:', error);
      alert(error.response?.data?.message || 'Error saving question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim().toLowerCase()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
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

  const backLink = subjectId || subject?._id;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          to={backLink ? `/subjects/${backLink}` : '/'}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to {subject?.title || 'Subject'}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            {isEditMode ? 'Edit Question' : 'Add New Question'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                placeholder="Enter your question..."
              />
            </div>

            {/* Answer Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detailed Answer *
              </label>
              <QuestionEditor
                value={formData.answer}
                onChange={(value) => setFormData({ ...formData, answer: value })}
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty Level *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['Easy', 'Medium', 'Hard'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: level })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.difficulty === level
                        ? 'border-gray-900 dark:border-white bg-gray-100 dark:bg-gray-800'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400'
                    }`}
                  >
                    <span className={`font-medium ${
                      formData.difficulty === level
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {level}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="input flex-1"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn btn-outline"
                >
                  Add
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-primary-600 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/subjects/${backLink}`)}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.title || !formData.answer}
                className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <FiSave className="w-5 h-5" />
                <span>{submitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create')} Question</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default QuestionEdit;
