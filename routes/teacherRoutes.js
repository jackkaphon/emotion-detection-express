const express = require('express');
const router = express.Router();
const TeacherController = require('../controllers/teacherController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, TeacherController.getAllTeachers);
router.get('/:id', authenticateToken, TeacherController.getTeacherById);
router.post('/', authenticateToken, TeacherController.createTeacher);
router.put('/:id', authenticateToken, TeacherController.updateTeacher);
router.delete('/:id', authenticateToken, TeacherController.deleteTeacher);

module.exports = router;