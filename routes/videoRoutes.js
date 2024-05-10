const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const upload = multer({ dest: 'uploads/videos' }); // Set the upload directory

router.post('/', upload.single('video'), (req, res) => {
    const inputFilePath = req.file.path;
    const outputFileName = `${uuidv4()}.mp4`;
    const outputFilePath = `uploads/videos/${outputFileName}`;

    const ffmpegProcess = spawn('ffmpeg', ['-i', inputFilePath, outputFilePath]);

    // Handle errors from the spawn process
    ffmpegProcess.on('error', (err) => {
        console.error('Failed to start ffmpeg process:', err);
        res.status(500).send('Failed to process video.');
    });

    ffmpegProcess.on('close', () => {
        console.log('Video processed successfully.');
        // Optionally, you can clean up the input file here
        fs.unlinkSync(inputFilePath);
    });

    res.status(200).send('Video processing started...');
});

module.exports = router;
