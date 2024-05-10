const apiResponse = {
    success: (res, status, message, data) => {
        const success = true;
        res.status(status).json({ success, message, data });
    },

    error: (res, status, message) => {
        const success = false;
        const data = null;
        res.status(status).json({ success, message, data });
    },
};

module.exports = apiResponse;