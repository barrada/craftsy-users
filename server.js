// server.js -  Users API Server Endpoint
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Allow requests from Gateway
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow all HTTP methods
  allowedHeaders: 'Content-Type,Authorization' // Allow the specified headers
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Use user routes
app.use('/api/users', userRoutes);

// log all incoming requests for testing and debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Users API Node is running on http://localhost:${PORT}`);
});