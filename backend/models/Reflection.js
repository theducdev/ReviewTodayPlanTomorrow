const mongoose = require('mongoose');

const ReflectionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    bestThing: { type: String, required: true },
    worstThing: { type: String, required: true },
    improvement: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reflection', ReflectionSchema);
