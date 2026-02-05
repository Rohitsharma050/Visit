import express from 'express';
import { body, validationResult } from 'express-validator';
import Subject from '../models/Subject.js';
import Question from '../models/Question.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   POST /api/subjects
// @desc    Create a new subject
// @access  Private
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { title, description } = req.body;

    const subject = await Subject.create({
      title,
      description,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject
    });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating subject',
      error: error.message
    });
  }
});

// @route   GET /api/subjects
// @desc    Get all subjects for logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    // Get question count for each subject
    const subjectsWithStats = await Promise.all(
      subjects.map(async (subject) => {
        const questionCount = await Question.countDocuments({ subjectId: subject._id });
        return {
          ...subject.toObject(),
          questionCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjectsWithStats
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message
    });
  }
});

// @route   GET /api/subjects/:id
// @desc    Get single subject with statistics
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Check ownership
    if (subject.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this subject'
      });
    }

    // Get statistics
    const totalQuestions = await Question.countDocuments({ subjectId: subject._id });
    const easyCount = await Question.countDocuments({ subjectId: subject._id, difficulty: 'Easy' });
    const mediumCount = await Question.countDocuments({ subjectId: subject._id, difficulty: 'Medium' });
    const hardCount = await Question.countDocuments({ subjectId: subject._id, difficulty: 'Hard' });

    // Get all unique tags
    const questions = await Question.find({ subjectId: subject._id }).select('tags');
    const allTags = [...new Set(questions.flatMap(q => q.tags))];

    res.status(200).json({
      success: true,
      data: {
        ...subject.toObject(),
        stats: {
          totalQuestions,
          difficulty: {
            easy: easyCount,
            medium: mediumCount,
            hard: hardCount
          },
          tags: allTags
        }
      }
    });
  } catch (error) {
    console.error('Get subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subject',
      error: error.message
    });
  }
});

// @route   PUT /api/subjects/:id
// @desc    Update subject
// @access  Private
router.put('/:id', [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Check ownership
    if (subject.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this subject'
      });
    }

    const { title, description } = req.body;

    if (title !== undefined) subject.title = title;
    if (description !== undefined) subject.description = description;

    await subject.save();

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject
    });
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subject',
      error: error.message
    });
  }
});

// @route   DELETE /api/subjects/:id
// @desc    Delete subject and all its questions
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Check ownership
    if (subject.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this subject'
      });
    }

    // Delete all questions associated with this subject
    await Question.deleteMany({ subjectId: subject._id });

    // Delete the subject
    await Subject.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Subject and all associated questions deleted successfully'
    });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subject',
      error: error.message
    });
  }
});

export default router;
