const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    output: { type: String, required: true },
    location: { type: String, required: true },
    time: { type: String, required: true },
    steps: { type: String, required: true }
});

const PlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Target date for the plan
    tasks: [TaskSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', PlanSchema);
