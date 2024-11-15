// models/userModel.js
const bcrypt = require('bcrypt');
const db = require('../config/db');

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
// check phone exists
async function checkPhoneExists(phone) {
  return new Promise((resolve, reject) => {
    db.execute('SELECT COUNT(*) AS count FROM users WHERE phone = ?', [phone], (err, results) => {
      if (err) return reject(err);
      const count = results[0].count;
      resolve(count > 0);
    });
  });
}
// Function to create a new user
async function createUser(firstName, lastName, phone, countryData, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const results = await db.execute(
      'INSERT INTO users (first_name, last_name, phone, country, password) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, phone, countryData.name, hashedPassword]
    );
    return results.insertId;
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes('phone')) {
      throw new Error('Phone number already exists');
    }
    throw err;
  }
}


module.exports = { findUser, createUser, checkPhoneExists };