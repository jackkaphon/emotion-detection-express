const encryption = require('../utils/encryption');
const apiResponse = require('../utils/apiResponse');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return apiResponse.error(res, 401, 'Unauthorized');
    }

    try {
        const user = encryption.verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        return apiResponse.error(res, 403, 'Forbidden');
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return apiResponse.error(res, 403, 'Forbidden, only admin can access this route');
    }

    next();
}

module.exports = { authenticateToken, isAdmin };
