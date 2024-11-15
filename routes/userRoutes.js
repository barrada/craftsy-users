const express = require('express');
const { authenticateUser, protectedRoute, registerUser } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const { checkPhoneExists } = require('../models/userModel');

const router = express.Router();

// Routes
router.post('/auth', authenticateUser);
router.post('/register', registerUser); 

// Protected Routes
router.get('/protected', authenticateToken, protectedRoute);

// New route to check if phone number exists
router.post('/check-phone', async (req, res) => {
  const { phone } = req.body;

  try {
    const phoneExists = await checkPhoneExists(phone);
    res.json({ exists: phoneExists });
  } catch (error) {
    console.error('Error checking phone number:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;