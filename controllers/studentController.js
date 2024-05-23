const UserService = require('../services/userService')
const apiResponse = require('../utils/apiResponse');
const encryption = require('../utils/encryption');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const FLASK_API_URL = process.env.FLASK_API_URL;

class StudentController {
    async getAllStudents(req, res, next) {
        try {
            const students = await UserService.getAllUsersByRole('student');
            return apiResponse.success(res, 200, 'Get all students success', students);
        } catch (error) {
            next(error);
        }
    }

    async getStudentById(req, res, next) {
        try {
            const { id } = req.params;
            const student = await UserService.getUserByIdAndRole(id, 'student');

            if (!student) {
                return apiResponse.error(res, 404, 'Student not found');
            }

            return apiResponse.success(res, 200, 'Get student by id success', student);
        } catch (error) {
            next(error);
        }
    }

    async createStudent(req, res, next) {
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
            const user = await UserService.createUser(name, hashPassword, email, role, file.filename, req.user.id);

            return apiResponse.success(res, 200, 'Create student success', user)
        } catch (error) {
            // Delete File if error
            fs.unlinkSync(req.file.path || '');
            next(error);
        }
    }

    async updateStudent(req, res, next) {
        try {
            const { id } = req.params;
            const { name, password, email } = req.body;
            const hashPassword = await encryption.hashPassword(password);
            const data = { name, password: hashPassword, email };
            const student = await UserService.updateUser(id, data);

            if (!student) {
                return apiResponse.error(res, 404, 'Student not found');
            }

            return apiResponse.success(res, 200, 'Update student success', student);
        } catch (error) {
            next(error);
        }
    }

    async deleteStudent(req, res, next) {
        try {
            const { id } = req.params;
            const student = await UserService.deleteUser(id);

            if (!student) {
                return apiResponse.error(res, 404, 'Student not found');
            }

            return apiResponse.success(res, 200, 'Delete student success', student);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StudentController();