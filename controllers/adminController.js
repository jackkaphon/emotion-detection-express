const UserService = require('../services/userService')
const apiResponse = require('../utils/apiResponse');
const encryption = require('../utils/encryption');

class AdminController {
    async getAllAdmins(req, res, next) {
        try {
            const admins = await UserService.getAllUsersByRole('admin');
            return apiResponse.success(res, 200, 'Get all admins success', admins);
        } catch (error) {
            next(error);
        }
    }

    async getAdminById(req, res, next) {
        try {
            const { id } = req.params;
            const admin = await UserService.getUserByIdAndRole(id, 'admin');

            if (!admin) {
                return apiResponse.error(res, 404, 'Admin not found');
            }

            return apiResponse.success(res, 200, 'Get admin by id success', admin);
        } catch (error) {
            next(error);
        }
    }

    async createAdmin(req, res, next) {
        try {
            const { name, password, email } = req.body;
            const role = 'admin';
            const hashPassword = await encryption.hashPassword(password);
            const newAdmin = await UserService.createUser(name, hashPassword, email, role, null, null);
            return apiResponse.success(res, 200, 'Create admin success', newAdmin);
        } catch (error) {
            next(error);
        }
    }

    async updateAdmin(req, res, next) {
        try {
            const { id } = req.params;
            const { name, password, email } = req.body;
            const hashPassword = await encryption.hashPassword(password);
            const data = { name, password: hashPassword, email };
            const admin = await UserService.updateUser(id, data);

            if (!admin) {
                return apiResponse.error(res, 404, 'Admin not found');
            }

            return apiResponse.success(res, 200, 'Update admin success', admin);
        } catch (error) {
            next(error);
        }
    }

    async deleteAdmin(req, res, next) {
        try {
            const { id } = req.params;
            const admin = await UserService.deleteUser(id);

            if (!admin) {
                return apiResponse.error(res, 404, 'Admin not found');
            }

            return apiResponse.success(res, 200, 'Delete admin success', admin);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminController();