const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, StudentController.getAllStudents);
router.get('/:id', authenticateToken, StudentController.getStudentById);
router.post('/', authenticateToken, StudentController.createStudent);
router.put('/:id', authenticateToken, StudentController.updateStudent);
router.delete('/:id', authenticateToken, StudentController.deleteStudent);

module.exports = router;