// models/userModel.js
const bcrypt = require('bcrypt');
const db = require('../db');

// Function to find user by phone and verify password
async function findUser(username, password) {
  return new Promise((resolve, reject) => {
    db.execute('SELECT * FROM users WHERE phone = ?', [phone], async (err, results) => {
      if (err) return reject(err);
      if (results.length > 0) {
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          resolve(user);
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
}

// Function to create a new user
async function createUser(name, password, phone) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    db.execute(
      'INSERT INTO users (name, password, phone) VALUES (?, ?, ?)',
      [username, hashedPassword, phone],
      (err, results) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes('phone')) {
            return reject(new Error('phone already exists'));
          }
          return reject(err);
        }
        resolve(results.insertId);
      }
    );
  });
}

module.exports = { findUser, createUser };