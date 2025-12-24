import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { Play, Pause, RotateCcw } from 'lucide-react';

const Meditation = () => {
    const [duration, setDuration] = useState(10); // minutes
    const [timeLeft, setTimeLeft] = useState(10 * 60);
    const [isActive, setIsActive] = useState(false);
    const [message, setMessage] = useState('');
    const timerRef = useRef(null);

    useEffect(() => {
        setTimeLeft(duration * 60);
    }, [duration]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timerRef.current);
            setIsActive(false);
            saveSession();
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(duration * 60);
    };

    const saveSession = async () => {
        try {
            const date = new Date().toISOString().split('T')[0];
            await api.post('/api/meditation', {
                date,
                duration: duration * 60
            });
            setMessage('Session completed and saved!');
            // Play a sound here if needed
        } catch (err) {
            console.error(err);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="p-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] pb-24 md:pb-6">
            <h2 className="text-3xl font-bold mb-8 text-blue-400">Meditation Timer</h2>

            <div className="mb-8">
                <label className="mr-4 text-lg">Set Duration (minutes):</label>
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="bg-slate-700 p-2 rounded w-20 text-center text-xl"
                    min="1"
                    disabled={isActive}
                />
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center rounded-full border-8 border-slate-700 mb-8">
                <span className="text-6xl font-mono font-bold text-blue-300">
                    {formatTime(timeLeft)}
                </span>
            </div>

            <div className="flex space-x-6">
                <button
                    onClick={toggleTimer}
                    className={`p-4 rounded-full transition-colors ${isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                        }`}
                >
                    {isActive ? <Pause size={32} /> : <Play size={32} />}
                </button>
                <button
                    onClick={resetTimer}
                    className="p-4 rounded-full bg-slate-600 hover:bg-slate-700 transition-colors"
                >
                    <RotateCcw size={32} />
                </button>
            </div>

            {message && <p className="mt-6 text-green-400 text-xl animate-bounce">{message}</p>}
        </div>
    );
};

export default Meditation;
