const UserService = require('../services/userService')
const apiResponse = require('../utils/apiResponse');
const encryption = require('../utils/encryption');

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
            const newStudent = await UserService.createUser(name, hashPassword, email, role);
            return apiResponse.success(res, 200, 'Create student success', newStudent);
        } catch (error) {
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