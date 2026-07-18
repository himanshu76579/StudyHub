const express = require('express');
const router = express.Router();

// Hamein yahan models ya bcrypt ki zaroorat nahi hai, sab controller handle karega!
const authController = require('../controllers/authController'); 

// --- ROUTES MAPPING ---
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/pending-admins', authController.getPendingAdmins);
router.put('/approve-admin/:id', authController.approveAdmin);
router.get('/user/:id', authController.getUserProfile);

module.exports = router;