import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Brain, Calendar, LogOut, Moon, LayoutDashboard } from 'lucide-react';

const Navbar = ({ setIsAuthenticated }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
        navigate('/login');
    };

    const navItems = [
        { path: '/reflection', label: 'Reflection', icon: Moon },
        { path: '/meditation', label: 'Meditation', icon: Brain },
        { path: '/reading', label: 'Reading', icon: BookOpen },
        { path: '/planning', label: 'Planning', icon: Calendar },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    return (
        <>
            {/* Desktop Sidebar/Topnav */}
            <div className="hidden md:flex flex-col w-64 bg-slate-800 h-screen fixed left-0 top-0 p-4">
                <h1 className="text-2xl font-bold text-blue-400 mb-8">Self Improve</h1>
                <div className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${location.pathname === item.path
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 text-red-400 hover:bg-slate-700 rounded-lg mt-auto"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-2 flex justify-around items-center z-50">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center p-2 rounded-lg ${location.pathname === item.path
                            ? 'text-blue-400'
                            : 'text-slate-400'
                            }`}
                    >
                        <item.icon size={24} />
                        <span className="text-xs mt-1">{item.label}</span>
                    </Link>
                ))}
                <button onClick={handleLogout} className="flex flex-col items-center p-2 text-red-400">
                    <LogOut size={24} />
                    <span className="text-xs mt-1">Logout</span>
                </button>
            </div>
        </>
    );
};

export default Navbar;
