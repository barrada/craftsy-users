// controllers/userController.js
const jwt = require('jsonwebtoken');
const { findUser, createUser } = require('../models/userModel');
const axios = require('axios');


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

// Protected Route
const protectedRoute = (req, res) => {
  // Implementation for the protected route
  res.status(200).json({ message: 'This is a protected route' });
};

// Registration handler

const registerUser = async (req, res) => {
  const { name, password, phone, countryData } = req.body;
  try {

      if (!countryData || !countryData.name) {
      return res.status(400).json({ error: 'Invalid country data' });
    }
        // Split the name into firstName and lastName
        const names = name.trim().split(' ');
        const firstName = names[0];
        const lastName = names.slice(1).join(' ');
        
    const userId = await createUser(firstName, lastName, phone, countryData, password);
    res.status(201).json({ id: userId, message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    if (err.message === 'Phone number already exists') {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { authenticateUser, protectedRoute, registerUser };