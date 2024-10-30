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

// Protected Route
const protectedRoute = (req, res) => {
  // Implementation for the protected route
  res.status(200).json({ message: 'This is a protected route' });
};

// Registration handler

const registerUser = async (req, res) => {
  const { name, password, phone, countryData } = req.body;

  try {
    // Split full name into first and last name
    const [firstName, lastName] = name.trim().split(' ');

    // Get country name from countryData
    const { name: country } = countryData;

    // Create new user
    const userId = await createUser(firstName, lastName, phone, country, password);

    res.status(201).json({ id: userId, message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Internal server error');
  }
};

//

module.exports = { authenticateUser, protectedRoute, registerUser };