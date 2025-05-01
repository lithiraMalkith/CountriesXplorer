const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
require('dotenv').config();

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: 'user' // Default role is 'user'
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  const { name, email, role } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Update user error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndRemove(req.params.id);
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error('Delete user error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
