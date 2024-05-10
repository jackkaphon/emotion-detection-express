const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

// Generate a JWT token
const generateToken = (user) => {
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });
    return token;
};

// Verify a JWT token
const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
};