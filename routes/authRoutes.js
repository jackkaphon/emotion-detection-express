const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const multer = require('multer');
// const upload = multer();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profiles/');
    },
    filename: function (req, file, cb) {
        const randomFilename = `${uuidv4()}.jpg`;
        cb(null, randomFilename);
    }
});

const upload = multer({ storage: storage });

router.post('/login', AuthController.login);
router.post('/register', upload.single('file'), AuthController.register);
router.post('/validate-token', authenticateToken, AuthController.validateToken);

module.exports = router;
