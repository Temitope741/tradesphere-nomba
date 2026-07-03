const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage } = require('../controllers/upload.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// All upload routes require an authenticated vendor or admin
router.use(protect, authorize('vendor', 'admin'));

router.post('/image', upload.single('image'), uploadImage);
router.delete('/image', deleteImage);

module.exports = router;