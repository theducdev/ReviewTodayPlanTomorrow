import React, { useState, useEffect } from 'react';
import api from '../api';

const Reflection = () => {
    const [formData, setFormData] = useState({
        bestThing: '',
        worstThing: '',
        improvement: ''
    });
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/api/reflection');
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const date = new Date().toISOString().split('T')[0];
            await api.post('/api/reflection', {
                ...formData,
                date
            });
            setMessage('Reflection saved successfully!');
            setFormData({ bestThing: '', worstThing: '', improvement: '' });
            fetchHistory();
        } catch (err) {
            setMessage('Error saving reflection.');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto pb-24 md:pb-6">
            <h2 className="text-3xl font-bold mb-6 text-blue-400">Daily Reflection</h2>

            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
                <div>
                    <label className="block text-lg font-medium mb-2 text-green-400">What was the most praiseworthy thing I did today?</label>
                    <textarea
                        value={formData.bestThing}
                        onChange={(e) => setFormData({ ...formData, bestThing: e.target.value })}
                        className="w-full bg-slate-700 p-4 rounded-lg h-32 focus:ring-2 focus:ring-green-500 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-lg font-medium mb-2 text-red-400">What was the most blameworthy thing I did today?</label>
                    <textarea
                        value={formData.worstThing}
                        onChange={(e) => setFormData({ ...formData, worstThing: e.target.value })}
                        className="w-full bg-slate-700 p-4 rounded-lg h-32 focus:ring-2 focus:ring-red-500 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-lg font-medium mb-2 text-yellow-400">If I could do it again, how would I do it?</label>
                    <textarea
                        value={formData.improvement}
                        onChange={(e) => setFormData({ ...formData, improvement: e.target.value })}
                        className="w-full bg-slate-700 p-4 rounded-lg h-32 focus:ring-2 focus:ring-yellow-500 outline-none"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold text-lg">
                    Save Reflection
                </button>
                {message && <p className="text-center mt-2 text-green-400">{message}</p>}
            </form>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-400">History</h3>
                {history.map((item) => (
                    <div key={item._id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <p className="text-sm text-slate-500 mb-2">{item.date}</p>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-green-400 font-bold text-sm">Praiseworthy</p>
                                <p className="text-slate-300 text-sm">{item.bestThing}</p>
                            </div>
                            <div>
                                <p className="text-red-400 font-bold text-sm">Blameworthy</p>
                                <p className="text-slate-300 text-sm">{item.worstThing}</p>
                            </div>
                            <div>
                                <p className="text-yellow-400 font-bold text-sm">Improvement</p>
                                <p className="text-slate-300 text-sm">{item.improvement}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reflection;
