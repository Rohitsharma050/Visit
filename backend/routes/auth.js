import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken, protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          profilePicture: req.user.profilePicture || null,
          authProvider: req.user.authProvider || 'local'
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// @route   POST /api/auth/google
// @desc    Authenticate or register user with Google OAuth
// @access  Public
router.post('/google', [
  body('googleId').notEmpty().withMessage('Google ID is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('name').trim().notEmpty().withMessage('Name is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { googleId, email, name, profilePicture, accessToken } = req.body;

    // Verify the Google access token by fetching user info
    try {
      const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!googleResponse.ok) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Google access token'
        });
      }

      const googleUserInfo = await googleResponse.json();

      // Verify the Google ID matches
      if (googleUserInfo.sub !== googleId) {
        return res.status(401).json({
          success: false,
          message: 'Google ID verification failed'
        });
      }
    } catch (verifyError) {
      console.error('Google token verification error:', verifyError);
      return res.status(401).json({
        success: false,
        message: 'Failed to verify Google token'
      });
    }

    // Optimized: Single query using findOneAndUpdate with upsert
    // First try to find by googleId, then by email
    let user = await User.findOneAndUpdate(
      { $or: [{ googleId }, { email }] },
      {
        $setOnInsert: {
          name,
          email,
          authProvider: 'google',
          createdAt: new Date()
        },
        $set: {
          googleId,
          profilePicture: profilePicture || undefined,
          updatedAt: new Date()
        }
      },
      { 
        upsert: true, 
        new: true,
        lean: true,
        setDefaultsOnInsert: true
      }
    );

    // Generate token immediately
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          authProvider: user.authProvider || 'google'
        }
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Error authenticating with Google',
      error: error.message
    });
  }
});

// @route   GET /api/auth/stats
// @desc    Get total user count (public)
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers: userCount
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
});

export default router;
