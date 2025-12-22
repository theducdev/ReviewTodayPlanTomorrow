import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Save, Trash2 } from 'lucide-react';

const Planning = () => {
    const [tasks, setTasks] = useState([
        { name: '', output: '', location: '', time: '', steps: '' },
        { name: '', output: '', location: '', time: '', steps: '' },
        { name: '', output: '', location: '', time: '', steps: '' }
    ]);
    const [message, setMessage] = useState('');
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/api/plan', {
                headers: { Authorization: token }
            });
            setPlans(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleTaskChange = (index, field, value) => {
        const newTasks = [...tasks];
        newTasks[index][field] = value;
        setTasks(newTasks);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // Calculate tomorrow's date
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dateStr = tomorrow.toISOString().split('T')[0];

            await api.post('/api/plan', {
                date: dateStr,
                tasks
            }, {
                headers: { Authorization: token }
            });
            setMessage('Plan for tomorrow saved!');
            fetchPlans();
        } catch (err) {
            setMessage('Error saving plan.');
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto pb-24 md:pb-6">
            <h2 className="text-3xl font-bold mb-6 text-blue-400">Plan for Tomorrow</h2>

            <form onSubmit={handleSubmit} className="mb-12">
                <div className="grid lg:grid-cols-3 gap-6">
                    {tasks.map((task, index) => (
                        <div key={index} className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                            <h3 className="text-xl font-bold mb-4 text-blue-300">Task {index + 1}</h3>
                            <div className="space-y-3">
                                <input
                                    placeholder="Task Name"
                                    value={task.name}
                                    onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                                    className="w-full bg-slate-700 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    placeholder="Expected Output"
                                    value={task.output}
                                    onChange={(e) => handleTaskChange(index, 'output', e.target.value)}
                                    className="w-full bg-slate-700 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                                <div className="flex space-x-2">
                                    <input
                                        placeholder="Location"
                                        value={task.location}
                                        onChange={(e) => handleTaskChange(index, 'location', e.target.value)}
                                        className="w-1/2 bg-slate-700 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                    <input
                                        placeholder="Time"
                                        value={task.time}
                                        onChange={(e) => handleTaskChange(index, 'time', e.target.value)}
                                        className="w-1/2 bg-slate-700 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <textarea
                                    placeholder="Steps to execute..."
                                    value={task.steps}
                                    onChange={(e) => handleTaskChange(index, 'steps', e.target.value)}
                                    className="w-full bg-slate-700 p-2 rounded h-24 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                    required
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit" className="mt-8 w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-lg font-bold text-xl shadow-lg transition-transform hover:scale-[1.01]">
                    Save Plan
                </button>
                {message && <p className="text-center mt-4 text-green-400 text-lg">{message}</p>}
            </form>

            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-400">Previous Plans</h3>
                {plans.map((plan) => (
                    <div key={plan._id} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h4 className="text-lg font-bold text-blue-400 mb-4">Target Date: {plan.date}</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                            {plan.tasks.map((task, i) => (
                                <div key={i} className="bg-slate-700 p-4 rounded-lg">
                                    <p className="font-bold text-white mb-1">{task.name}</p>
                                    <p className="text-sm text-slate-300 mb-1">Output: {task.output}</p>
                                    <p className="text-xs text-slate-400">{task.time} @ {task.location}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Planning;
