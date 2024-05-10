const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, isAdmin, AdminController.getAllAdmins);
router.get('/:id', authenticateToken, isAdmin, AdminController.getAdminById);
router.post('/', authenticateToken, isAdmin, AdminController.createAdmin);
router.put('/:id', authenticateToken, isAdmin, AdminController.updateAdmin);
router.delete('/:id', authenticateToken, isAdmin, AdminController.deleteAdmin);

module.exports = router;
