import React, { useState, useEffect } from 'react';
import api from '../api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/api/dashboard');
            setData(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Loading Dashboard...</div>;
    if (!data) return <div className="p-8 text-center text-white">No data available</div>;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const ChartCard = ({ title, children }) => (
        <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 flex flex-col h-80">
            <h3 className="text-lg font-bold text-blue-400 mb-4">{title}</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto pb-24 md:pb-6">
            <h2 className="text-3xl font-bold mb-8 text-blue-400">Personal Dashboard</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Weekly Focus Time */}
                <ChartCard title="Weekly Focus (Mins)">
                    <BarChart data={data.weeklyFocus}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                        <Legend />
                        <Bar dataKey="meditation" stackId="a" fill="#8884d8" name="Meditation" />
                        <Bar dataKey="reading" stackId="a" fill="#82ca9d" name="Reading" />
                    </BarChart>
                </ChartCard>

                {/* 2. Reading Trend */}
                <ChartCard title="Reading Trend">
                    <AreaChart data={data.weeklyReading}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                        <Area type="monotone" dataKey="minutes" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                </ChartCard>

                {/* 3. Meditation Trend */}
                <ChartCard title="Meditation Trend">
                    <LineChart data={data.weeklyMeditation}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                        <Line type="monotone" dataKey="minutes" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ChartCard>

                {/* 4. Tasks Planned */}
                <ChartCard title="Tasks Planned">
                    <BarChart data={data.weeklyTasks}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#9CA3AF" allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                        <Bar dataKey="tasks" fill="#FFBB28" />
                    </BarChart>
                </ChartCard>

                {/* 5. Time Distribution */}
                <ChartCard title="Total Time Distribution">
                    <PieChart>
                        <Pie
                            data={data.timeDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.timeDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                        <Legend />
                    </PieChart>
                </ChartCard>

                {/* 6. Reflection Word Count */}
                <ChartCard title="Reflection Depth (Words)">
                    <LineChart data={data.reflectionTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                        <Line type="monotone" dataKey="words" stroke="#FF8042" strokeWidth={2} />
                    </LineChart>
                </ChartCard>

                {/* 7. Activity by Day */}
                <ChartCard title="Activity by Day">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.activityByDay}>
                        <PolarGrid stroke="#374151" />
                        <PolarAngleAxis dataKey="day" stroke="#9CA3AF" />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="#374151" />
                        <Radar name="Activity" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                    </RadarChart>
                </ChartCard>

                {/* 8. Total Sessions */}
                <ChartCard title="Total Sessions">
                    <BarChart data={data.sessionCounts} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9CA3AF" />
                        <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={80} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                        <Bar dataKey="count" fill="#00C49F" />
                    </BarChart>
                </ChartCard>

                {/* 9. Cumulative Growth */}
                <ChartCard title="Cumulative Growth (7 Days)">
                    <AreaChart data={data.growth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                        <Area type="monotone" dataKey="total" stroke="#8884d8" fill="url(#colorTotal)" />
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                    </AreaChart>
                </ChartCard>
            </div>
        </div>
    );
};

export default Dashboard;
