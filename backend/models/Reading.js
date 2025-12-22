const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    duration: { type: Number, required: true }, // in seconds
    notes: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reading', ReadingSchema);
