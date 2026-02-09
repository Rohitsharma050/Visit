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
    // Optimized: Use aggregation to get subjects with question counts in single query
    const subjectsWithStats = await Subject.aggregate([
      { $match: { createdBy: req.user._id } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'questions',
          localField: '_id',
          foreignField: 'subjectId',
          as: 'questions'
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          createdBy: 1,
          createdAt: 1,
          updatedAt: 1,
          questionCount: { $size: '$questions' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: subjectsWithStats.length,
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
    const subject = await Subject.findById(req.params.id).lean();

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

    // Optimized: Single aggregation query for all stats
    const [stats] = await Question.aggregate([
      { $match: { subjectId: subject._id } },
      {
        $facet: {
          counts: [
            {
              $group: {
                _id: '$difficulty',
                count: { $sum: 1 }
              }
            }
          ],
          tags: [
            { $unwind: { path: '$tags', preserveNullAndEmptyArrays: false } },
            { $group: { _id: '$tags' } }
          ],
          total: [{ $count: 'count' }]
        }
      }
    ]);

    // Process aggregation results
    const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
    stats.counts.forEach(item => {
      if (item._id === 'Easy') difficultyCounts.easy = item.count;
      else if (item._id === 'Medium') difficultyCounts.medium = item.count;
      else if (item._id === 'Hard') difficultyCounts.hard = item.count;
    });

    const allTags = stats.tags.map(t => t._id);
    const totalQuestions = stats.total[0]?.count || 0;

    res.status(200).json({
      success: true,
      data: {
        ...subject,
        stats: {
          totalQuestions,
          difficulty: difficultyCounts,
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
