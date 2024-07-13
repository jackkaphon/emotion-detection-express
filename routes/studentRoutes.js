const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

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

router.get('/', authenticateToken, StudentController.getAllStudents);
router.get('/profile', authenticateToken, StudentController.getProfile);
router.get('/:id', authenticateToken, StudentController.getStudentById);
router.post('/', authenticateToken, upload.single('file'), StudentController.createStudent);
router.put('/:id', authenticateToken, StudentController.updateStudent);
router.delete('/:id', authenticateToken, StudentController.deleteStudent);


module.exports = router;