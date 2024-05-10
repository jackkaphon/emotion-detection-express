const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

const UserService = require('../services/userService')
const apiResponse = require('../utils/apiResponse');
const encryption = require('../utils/encryption');

const FLASK_API_URL = process.env.FLASK_API_URL;

class AuthController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await UserService.getUserByEmail(email);

            if (!user) {
                return apiResponse.error(res, 404, 'User not found');
            }

            const comparePassword = await encryption.comparePassword(password, user.password);

            if (!comparePassword) {
                return apiResponse.error(res, 401, 'Password is incorrect');
            }

            // Generate token
            const token = encryption.generateToken(user);

            const data = {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            };

            return apiResponse.success(res, 200, 'Login success', data);
        } catch (error) {
            next(error);
        }
    }

    async register(req, res, next) {
        try {
            const { name, password, email } = req.body;

            const role = 'student';

            const hashPassword = await encryption.hashPassword(password);

            // Uploaded file information
            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // Form data
            const formData = new FormData();
            formData.append('name', name);

            formData.append('file', fs.createReadStream(file.path), {
                filename: file.originalname, // Specify the original filename
                contentType: file.mimetype // Specify the file content type
            });

            // Send file to Flask API
            const response = await axios({
                method: 'post',
                url: `${FLASK_API_URL}/images/train`,
                data: formData,
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
                }
            });

            // Get uploaded file name
            if (response.status !== 200) {
                return apiResponse.error(res, 400, 'Error training image');
            }

            // Save user to database
            const user = await UserService.createUser(name, hashPassword, email, role, file.filename);

            return apiResponse.success(res, 200, 'Register success', user);
        } catch (error) {
            next(error);
        }
    }

    async validateToken(req, res, next) {
        try {
            return apiResponse.success(res, 200, 'Token is valid', {});
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthController();
