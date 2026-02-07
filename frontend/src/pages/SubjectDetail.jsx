import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiDownload, FiArrowLeft, FiBookOpen } from 'react-icons/fi';
import api from '../utils/api';
import { exportSubjectToPDF } from '../utils/pdfExport';
import Navbar from '../components/Navbar';
import QuestionCard from '../components/QuestionCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import StatsCard from '../components/StatsCard';

const SubjectDetail = () => {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchSubjectAndQuestions();
  }, [id]);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, difficulty, selectedTag]);

  const fetchSubjectAndQuestions = async () => {
    try {
      const [subjectRes, questionsRes] = await Promise.all([
        api.get(`/subjects/${id}`),
        api.get(`/questions/subject/${id}`)
      ]);
      
      setSubject(subjectRes.data.data);
      setQuestions(questionsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = [...questions];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(term) ||
        q.answer.toLowerCase().includes(term)
      );
    }

    // Difficulty filter
    if (difficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter(q => q.tags.includes(selectedTag));
    }

    setFilteredQuestions(filtered);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await api.delete(`/questions/${questionId}`);
      fetchSubjectAndQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert(error.response?.data?.message || 'Error deleting question');
    }
  };

  const handleExportPDF = () => {
    if (subject && questions.length > 0) {
      exportSubjectToPDF(subject, questions);
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

  if (!subject) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Subject not found
          </h2>
          <Link to="/dashboard" className="btn btn-primary mt-4">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Subjects
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {subject.title}
              </h1>
              {subject.description && (
                <p className="text-gray-600 dark:text-gray-400">
                  {subject.description}
                </p>
              )}
            </div>
            
            <div className="flex space-x-3">
              {questions.length > 0 && (
                <button
                  onClick={handleExportPDF}
                  className="btn btn-outline flex items-center space-x-2"
                >
                  <FiDownload className="w-5 h-5" />
                  <span className="hidden sm:inline">Export PDF</span>
                </button>
              )}
              <Link
                to={`/questions/new/${id}`}
                className="btn btn-primary flex items-center space-x-2"
              >
                <FiPlus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Question</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {subject.stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Questions"
              value={subject.stats.totalQuestions}
              icon={FiBookOpen}
              color="primary"
            />
            <StatsCard
              title="Easy"
              value={subject.stats.difficulty.easy}
              color="green"
            />
            <StatsCard
              title="Medium"
              value={subject.stats.difficulty.medium}
              color="yellow"
            />
            <StatsCard
              title="Hard"
              value={subject.stats.difficulty.hard}
              color="red"
            />
          </div>
        )}

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>
          <FilterPanel
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            availableTags={subject.stats?.tags || []}
          />
        </div>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❓</div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {questions.length === 0 ? 'No questions yet' : 'No questions found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {questions.length === 0
                ? 'Add your first question to this subject'
                : 'Try adjusting your search or filters'}
            </p>
            {questions.length === 0 && (
              <Link to={`/questions/new/${id}`} className="btn btn-primary">
                Add Question
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredQuestions.map((question) => (
              <QuestionCard
                key={question._id}
                question={question}
                onDelete={handleDeleteQuestion}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectDetail;
