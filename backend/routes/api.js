const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Reflection = require('../models/Reflection');
const Meditation = require('../models/Meditation');
const Reading = require('../models/Reading');
const Plan = require('../models/Plan');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.userId;
        next();
    });
};

router.use(verifyToken);

// --- Reflection Routes ---
router.post('/reflection', async (req, res) => {
    try {
        const newReflection = new Reflection({ ...req.body, userId: req.userId });
        await newReflection.save();
        res.status(201).json(newReflection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/reflection', async (req, res) => {
    try {
        const reflections = await Reflection.find({ userId: req.userId }).sort({ date: -1 });
        res.json(reflections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Meditation Routes ---
router.post('/meditation', async (req, res) => {
    try {
        const newMeditation = new Meditation({ ...req.body, userId: req.userId });
        await newMeditation.save();
        res.status(201).json(newMeditation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/meditation', async (req, res) => {
    try {
        const meditations = await Meditation.find({ userId: req.userId }).sort({ date: -1 });
        res.json(meditations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Reading Routes ---
router.post('/reading', async (req, res) => {
    try {
        const newReading = new Reading({ ...req.body, userId: req.userId });
        await newReading.save();
        res.status(201).json(newReading);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/reading', async (req, res) => {
    try {
        const readings = await Reading.find({ userId: req.userId }).sort({ date: -1 });
        res.json(readings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Plan Routes ---
router.post('/plan', async (req, res) => {
    try {
        const newPlan = new Plan({ ...req.body, userId: req.userId });
        await newPlan.save();
        res.status(201).json(newPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/plan', async (req, res) => {
    try {
        const plans = await Plan.find({ userId: req.userId }).sort({ date: -1 });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Dashboard Routes ---
router.get('/dashboard', async (req, res) => {
    try {
        const userId = req.userId;

        // Fetch all data
        const reflections = await Reflection.find({ userId });
        const meditations = await Meditation.find({ userId });
        const readings = await Reading.find({ userId });
        const plans = await Plan.find({ userId });

        // Helper to get last 7 days dates
        const getLast7Days = () => {
            const dates = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                dates.push(d.toISOString().split('T')[0]);
            }
            return dates;
        };
        const last7Days = getLast7Days();

        // 1. Weekly Focus Time (Meditation + Reading)
        const weeklyFocus = last7Days.map(date => {
            const medDuration = meditations
                .filter(m => m.date === date)
                .reduce((acc, curr) => acc + curr.duration, 0) / 60; // minutes
            const readDuration = readings
                .filter(r => r.date === date)
                .reduce((acc, curr) => acc + curr.duration, 0) / 60; // minutes
            return { date, meditation: medDuration, reading: readDuration };
        });

        // 2. Weekly Reading Minutes
        const weeklyReading = last7Days.map(date => ({
            date,
            minutes: readings
                .filter(r => r.date === date)
                .reduce((acc, curr) => acc + curr.duration, 0) / 60
        }));

        // 3. Weekly Meditation Minutes
        const weeklyMeditation = last7Days.map(date => ({
            date,
            minutes: meditations
                .filter(m => m.date === date)
                .reduce((acc, curr) => acc + curr.duration, 0) / 60
        }));

        // 4. Tasks Planned per Day (Last 7 Days)
        const weeklyTasks = last7Days.map(date => {
            const plan = plans.find(p => p.date === date);
            return { date, tasks: plan ? plan.tasks.length : 0 };
        });

        // 5. Total Time Distribution (Pie Chart)
        const totalMeditation = meditations.reduce((acc, curr) => acc + curr.duration, 0) / 60;
        const totalReading = readings.reduce((acc, curr) => acc + curr.duration, 0) / 60;
        const timeDistribution = [
            { name: 'Meditation', value: totalMeditation },
            { name: 'Reading', value: totalReading }
        ];

        // 6. Reflection Word Count Trend (Last 7 entries)
        const reflectionTrends = reflections
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-7)
            .map(r => ({
                date: r.date,
                words: (r.bestThing + r.worstThing + r.improvement).split(' ').length
            }));

        // 7. Activity by Day of Week (Radar)
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const activityByDay = daysOfWeek.map((day, index) => {
            const medCount = meditations.filter(m => new Date(m.date).getDay() === index).length;
            const readCount = readings.filter(r => new Date(r.date).getDay() === index).length;
            return { day, A: medCount + readCount, fullMark: 10 }; // A is activity
        });

        // 8. Session Counts (Bar)
        const sessionCounts = [
            { name: 'Meditation', count: meditations.length },
            { name: 'Reading', count: readings.length },
            { name: 'Reflections', count: reflections.length },
            { name: 'Plans', count: plans.length }
        ];

        // 9. Cumulative Growth (Minutes over time - simplified to last 7 days cumulative)
        let cumulative = 0;
        const growth = last7Days.map(date => {
            const dayMins = (meditations.filter(m => m.date === date).reduce((acc, c) => acc + c.duration, 0) +
                readings.filter(r => r.date === date).reduce((acc, c) => acc + c.duration, 0)) / 60;
            cumulative += dayMins;
            return { date, total: cumulative };
        });

        res.json({
            weeklyFocus,
            weeklyReading,
            weeklyMeditation,
            weeklyTasks,
            timeDistribution,
            reflectionTrends,
            activityByDay,
            sessionCounts,
            growth
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
