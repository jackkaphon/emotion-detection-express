const User = require('../models/User');

class UserService {
    async getAllUsers() {
        return await User.find();
    }

    async getAllUsersByRole(role) {
        // Get users by role and join createdBy with user info
        return await User.find({
            role: role,

        }).populate('createdBy').exec();
    }

    async getUserById(id) {
        return await User.findById(id);
    }

    async getUserByName(name) {
        return await User.findOne({
            name: name
        });
    }

    async getUserByEmail(email) {
        return await User.findOne({
            email: email
        });
    }

    async getUserByIdAndRole(id, role) {
        return await User.findOne({
            _id: id,
            role: role
        });
    }

    async createUser(name, password, email, role, image, createdBy) {
        const newUser = new User({ name, password, email, role, image, createdBy });
        await newUser.save();
        return newUser;
    }

    async updateUser(id, data) {
        return await User.findByIdAndUpdate(id, data, { new: true });
    }

    async updateUserByRole(id, role, data) {
        return await User.findOneAndUpdate({ _id: id, role: role }, data
            , { new: true });
    }

    async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }
}

module.exports = new UserService();