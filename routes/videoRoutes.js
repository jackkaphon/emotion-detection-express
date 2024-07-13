const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const Video = require('../models/Video');
const { authenticateToken } = require('../middlewares/authMiddleware');
const path = require('path');
const apiResponse = require('../utils/apiResponse');
const VideoDetail = require('../models/VideoDetail');
const User = require('../models/User');

const upload = multer({ dest: 'uploads/videos' }); // Set the upload directory

// Route to get all videos
router.get('/', authenticateToken, async (req, res) => {
    try {
        const videos = await Video.find().populate('createdBy').exec();
        return apiResponse.success(res, 200, 'Get all videos success', videos);
    } catch (err) {
        console.error('Error fetching videos:', err);
        res.status(500).send('Server error');
    }
});

// Route to get a video detail by id
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const videoId = req.params.id;
        const video = await Video.findById(videoId).populate('createdBy').exec();

        if (!video) {
            return apiResponse.error(res, 404, 'Video not found');
        }

        const videoDetails = await VideoDetail.find({ videoId: videoId }).populate('studentId').exec();
        return apiResponse.success(res, 200, 'Get video detail success', { video, videoDetails });
    } catch (err) {
        console.error('Error fetching video detail:', err);
        res.status(500).send('Server error');
    }
});

// Route to serve video files
router.get('/play/:id', authenticateToken, async (req, res) => {
    try {
        const videoId = req.params.id;
        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).send('Video not found');
        }

        const videoPath = path.join(__dirname, '..', video.videoUrl);
        res.sendFile(videoPath);
    } catch (err) {
        console.error('Error fetching video:', err);
        res.status(500).send('Server error');
    }
});

router.post('/', authenticateToken, upload.single('video'), (req, res) => {
    const inputFilePath = req.file.path;
    const outputFileName = `${uuidv4()}.mp4`;
    const outputFilePath = `uploads/videos/${outputFileName}`;

    const ffmpegProcess = spawn('ffmpeg', ['-i', inputFilePath, outputFilePath]);

    // Handle errors from the spawn process
    ffmpegProcess.on('error', (err) => {
        console.error('Failed to start ffmpeg process:', err);
        res.status(500).send('Failed to process video.');
    });

    // Get form data from the request
    const { title, description, faceEmotionHistory } = req.body;

    ffmpegProcess.on('close', () => {
        console.log('Video processed successfully.');
        // Optionally, you can clean up the input file here
        fs.unlinkSync(inputFilePath);

        // Save the video to the database
        const video = new Video({
            title: title,
            description: description,
            videoUrl: outputFilePath,
            thumbnailUrl: 'uploads/thumbnails/default.jpg',
            createdBy: req.user.id,
        });

        video.save().then((savedVideo) => {
            const faceEmotionData = JSON.parse(faceEmotionHistory);

            console.log('Face emotion data:', faceEmotionData);

            faceEmotionData.forEach(async (faceEmotion) => {
                try {
                    // Assuming Student model has a field 'name' for the student's name
                    const student = await User.findOne({ name: faceEmotion.name });

                    if (!student) {
                        console.error('Student not found for name:', faceEmotion.name);
                        return;
                    }

                    const videoDetail = new VideoDetail({
                        videoId: savedVideo._id,
                        studentId: student._id, // Assuming studentId is ObjectId
                        happCount: faceEmotion.Happy,
                        sadCount: faceEmotion.Sad,
                        disgustCount: faceEmotion.Disgust,
                        angryCount: faceEmotion.Angry,
                        surpriseCount: faceEmotion.Surprise,
                        fearCount: faceEmotion.Fear,
                        neutralCount: faceEmotion.Neutral,
                    });

                    await videoDetail.save();
                } catch (err) {
                    console.error('Error processing face emotion data:', err);
                }
            });

            return apiResponse.success(res, 200, 'Video uploaded successfully', { videoUrl: outputFilePath });
        }).catch(err => {
            console.error('Failed to save video to the database:', err);
            res.status(500).send('Failed to save video to the database.');
        });
    });
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const videoId = req.params.id;
        const video = await Video.findById(videoId);

        if (!video) {
            return apiResponse.error(res, 404, 'Video not found');
        }

        if (video.createdBy.toString() !== req.user.id) {
            return apiResponse.error(res, 403, 'Forbidden, you can only delete your own videos');
        }

        await video.remove();
        return apiResponse.success(res, 200, 'Video deleted successfully');
    } catch (err) {
        console.error('Error deleting video:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
