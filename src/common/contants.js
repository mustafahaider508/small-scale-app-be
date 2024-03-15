const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Get Password Hash
const getPasswordHash = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  } catch (err) {
    console.log(err.message);
  }
};

// GET Token
const getToken = async ({ payload, expiresIn }) => {
  try {
    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: expiresIn },
        (err, token) => {
          if (err) reject(err);
          resolve(token);
        }
      );
    });

    return token;
  } catch (err) {
    console.log(err.message);
  }
};

// Match Pasword Hash
const matchPassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (err) {
    console.log(err.message);
  }
};

function generateRandomPassword(length = 6) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

const authUtils = {
  getToken,
  getPasswordHash,
  matchPassword,
  generateRandomPassword,
};

module.exports = authUtils;
