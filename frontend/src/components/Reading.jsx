import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { Play, Pause, Save } from 'lucide-react';

const Reading = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');
    const timerRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive]);

    const toggleTimer = () => setIsActive(!isActive);

    const handleSave = async () => {
        setIsActive(false);
        try {
            const token = localStorage.getItem('token');
            const date = new Date().toISOString().split('T')[0];
            await api.post('/api/reading', {
                date,
                duration: seconds,
                notes
            }, {
                headers: { Authorization: token }
            });
            setMessage('Reading session saved!');
            setSeconds(0);
            setNotes('');
        } catch (err) {
            console.error(err);
            setMessage('Error saving session.');
        }
    };

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hours > 0 ? hours + ':' : ''}${mins < 10 && hours > 0 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="p-6 max-w-4xl mx-auto pb-24 md:pb-6">
            <h2 className="text-3xl font-bold mb-6 text-blue-400">Reading Tracker</h2>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-800 p-8 rounded-xl flex flex-col items-center justify-center shadow-lg">
                    <div className="text-6xl font-mono font-bold text-white mb-8">
                        {formatTime(seconds)}
                    </div>
                    <button
                        onClick={toggleTimer}
                        className={`px-8 py-4 rounded-full flex items-center space-x-2 text-xl font-bold transition-colors ${isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {isActive ? <><Pause /> <span>Pause</span></> : <><Play /> <span>Start Reading</span></>}
                    </button>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col">
                    <label className="text-lg font-medium mb-4 text-slate-300">Notes & Key Takeaways</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="flex-1 bg-slate-700 p-4 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none min-h-[200px]"
                        placeholder="What did you learn today?"
                    />
                    <button
                        onClick={handleSave}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold flex items-center justify-center space-x-2"
                        disabled={seconds === 0 && !notes}
                    >
                        <Save size={20} />
                        <span>Save Session</span>
                    </button>
                    {message && <p className="text-center mt-2 text-green-400">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Reading;
