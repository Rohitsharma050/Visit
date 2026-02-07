import express from 'express';
import { body, validationResult } from 'express-validator';
import Question from '../models/Question.js';
import Subject from '../models/Subject.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   POST /api/questions
// @desc    Create a new question
// @access  Private
router.post('/', [
  body('subjectId').notEmpty().withMessage('Subject ID is required'),
  body('title').trim().notEmpty().withMessage('Question title is required'),
  body('answer').notEmpty().withMessage('Answer is required'),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']).withMessage('Invalid difficulty level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { subjectId, title, answer, difficulty, tags } = req.body;

    // Verify subject exists and belongs to user
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    if (subject.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add questions to this subject'
      });
    }

    const question = await Question.create({
      subjectId,
      title,
      answer,
      difficulty,
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating question',
      error: error.message
    });
  }
});

// @route   GET /api/questions/subject/:subjectId
// @desc    Get all questions for a subject (with search and filters)
// @access  Private
router.get('/subject/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { search, difficulty, tags, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Verify subject exists and belongs to user
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    if (subject.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this subject'
      });
    }

    // Build query
    let query = { subjectId };

    // Search in title and answer
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by difficulty
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    // Execute query
    const sortOrder = order === 'asc' ? 1 : -1;
    const questions = await Question.find(query).sort({ [sortBy]: sortOrder });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
});

// @route   GET /api/questions/:id
// @desc    Get single question
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('subjectId');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Verify ownership through subject
    if (question.subjectId.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this question'
      });
    }

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question',
      error: error.message
    });
  }
});

// @route   PUT /api/questions/:id
// @desc    Update question
// @access  Private
router.put('/:id', [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('answer').optional().notEmpty().withMessage('Answer cannot be empty'),
  body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']).withMessage('Invalid difficulty level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const question = await Question.findById(req.params.id).populate('subjectId');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Verify ownership through subject
    if (question.subjectId.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this question'
      });
    }

    const { title, answer, difficulty, tags } = req.body;

    if (title !== undefined) question.title = title;
    if (answer !== undefined) question.answer = answer;
    if (difficulty !== undefined) question.difficulty = difficulty;
    if (tags !== undefined) question.tags = tags;

    await question.save();

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: question
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating question',
      error: error.message
    });
  }
});

// @route   DELETE /api/questions/:id
// @desc    Delete question
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('subjectId');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Verify ownership through subject
    if (question.subjectId.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question'
      });
    }

    await Question.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting question',
      error: error.message
    });
  }
});

export default router;
