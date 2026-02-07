import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import SubjectCard from '../components/SubjectCard';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/subjects', formData);
      setFormData({ title: '', description: '' });
      setShowModal(false);
      fetchSubjects();
    } catch (error) {
      console.error('Error creating subject:', error);
      alert(error.response?.data?.message || 'Error creating subject');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!confirm('Are you sure? This will delete all questions in this subject.')) {
      return;
    }

    try {
      await api.delete(`/subjects/${id}`);
      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      alert(error.response?.data?.message || 'Error deleting subject');
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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              My Subjects
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your question banks
            </p>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <FiPlus className="w-5 h-5" />
            <span className="hidden sm:inline">New Subject</span>
          </button>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No subjects yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first subject to start adding questions
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              Create Subject
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject._id}
                subject={subject}
                onDelete={handleDeleteSubject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Create New Subject
            </h2>
            
            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="e.g., Data Structures"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows="3"
                  placeholder="Optional description..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ title: '', description: '' });
                  }}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary flex-1"
                >
                  {submitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
