const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary'); // Cloudinary config se sirf upload middleware chahiye
const { uploadResource, getAllResources, deleteResource } = require('../controllers/resourceController');

// Routes mapping
router.post('/upload', protect, adminOnly, upload.single('file'), uploadResource);
router.get('/', protect, getAllResources);
router.delete('/:id', protect, deleteResource);

module.exports = router;