// controllers/userController.js
const jwt = require('jsonwebtoken');
const { findUser, createUser } = require('../models/userModel');

// Function to generate a JWT token
function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
}

// Login handler
const authenticateUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await findUser(username, password);
  
  if (!user) {
    return res.status(401).send('Invalid credentials');
  }

  const token = generateToken(user);
  res.json({ token });
};

// Registration handler
const registerUser = async (req, res) => {
  const { name, password, phone } = req.body;

  try {
    // Check if user already exists
    const existingUser = await findUser(phone, password);
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const userId = await createUser(name, password, phone, country);
    res.status(201).json({ id: userId, message: 'User registered successfully' });
  } catch (err) {
    if (err.message === 'phone already exists') {
      return res.status(400).send('phone already exists');
    }
    console.error('Error registering user:', err);
    res.status(500).send('Internal server error');
  }
};

// Protected route handler
const protectedRoute = (req, res) => {
  res.send(`Hello ${req.user.username}, you have access to this protected route!`);
};

//

module.exports = { authenticateUser, protectedRoute, registerUser };