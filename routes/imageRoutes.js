const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User');

router.get('/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const image = await User.findOne({ image: filename });

        if (!image) {
            return res.status(404).send('Image not found');
        }

        const filePath = path.join(__dirname, '../uploads/profiles', filename);

        res.sendFile(filePath);
    } catch (err) {
        console.error('Error fetching image:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;