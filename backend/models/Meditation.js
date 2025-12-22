const mongoose = require('mongoose');

const MeditationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    duration: { type: Number, required: true }, // in seconds
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meditation', MeditationSchema);
