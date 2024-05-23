const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoDetailSchema = new Schema({
    videoId: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    happCount: { type: Number, default: 0 },
    sadCount: { type: Number, default: 0 },
    disgustCount: { type: Number, default: 0 },
    angryCount: { type: Number, default: 0 },
    surpriseCount: { type: Number, default: 0 },
    fearCount: { type: Number, default: 0 },
    neutralCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const VideoDetail = mongoose.model('VideoDetail', videoDetailSchema);

module.exports = VideoDetail;