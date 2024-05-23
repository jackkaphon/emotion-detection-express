const UserService = require('../services/userService')
const apiResponse = require('../utils/apiResponse');
const encryption = require('../utils/encryption');

class TeacherController {
    async getAllTeachers(req, res, next) {
        try {
            const teachers = await UserService.getAllUsersByRole('teacher');
            return apiResponse.success(res, 200, 'Get all teachers success', teachers);
        } catch (error) {
            next(error);
        }
    }

    async getTeacherById(req, res, next) {
        try {
            const { id } = req.params;
            const teacher = await UserService.getUserByIdAndRole(id, 'teacher');

            if (!teacher) {
                return apiResponse.error(res, 404, 'Teacher not found');
            }

            return apiResponse.success(res, 200, 'Get teacher by id success', teacher);
        } catch (error) {
            next(error);
        }
    }

    async createTeacher(req, res, next) {
        try {
            const { name, password, email } = req.body;
            const role = 'teacher';
            const hashPassword = await encryption.hashPassword(password);
            const newTeacher = await UserService.createUser(name, hashPassword, email, role, null, req.user.id);
            return apiResponse.success(res, 200, 'Create teacher success', newTeacher);
        } catch (error) {
            next(error);
        }
    }

    async updateTeacher(req, res, next) {
        try {
            const { id } = req.params;
            const { name, password, email } = req.body;
            const hashPassword = await encryption.hashPassword(password);
            const data = { name, password: hashPassword, email };
            const teacher = await UserService.updateUser(id, data);

            if (!teacher) {
                return apiResponse.error(res, 404, 'Teacher not found');
            }

            return apiResponse.success(res, 200, 'Update teacher success', teacher);
        } catch (error) {
            next(error);
        }
    }

    async deleteTeacher(req, res, next) {
        try {
            const { id } = req.params;
            const teacher = await UserService.deleteUser(id);

            if (!teacher) {
                return apiResponse.error(res, 404, 'Teacher not found');
            }

            return apiResponse.success(res, 200, 'Delete teacher success', teacher);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TeacherController()