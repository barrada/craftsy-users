// db.js
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  socketPath: process.env.DB_SOCKET_PATH || null, // Use socket path if provided
  user: process.env.DB_USER || 'root', // Change to your MySQL user
  password: process.env.DB_PASSWORD || '', // Change to your MySQL password
  database: process.env.DB_NAME || 'users', // Database name
  port: process.env.DB_PORT || 3306, // Default port, will not be used if socketPath is set
});

connection.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database.');
});

module.exports = connection;