import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('access_token')));

    useEffect(() => {
        setIsAuthenticated(Boolean(localStorage.getItem('access_token')));
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200 select-none cursor-default">
                            LIFEPAUSE
                        </span>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-6">
                        {isAuthenticated ? (
                            <>
                                <Link to="/calendar" className="text-slate-300 hover:text-white transition-colors">Kalendar</Link>
                                <Link to="/recurring-plans" className="text-slate-300 hover:text-white transition-colors">Kunlik rejalar</Link>
                                <Link to="/dashboard#results" className="text-slate-300 hover:text-white transition-colors">Natijalar</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/features" className="text-slate-300 hover:text-white transition-colors">Imkoniyatlar</Link>
                                <Link to="/ai" className="text-slate-300 hover:text-white transition-colors">SI</Link>
                                <Link to="/pricing" className="text-slate-300 hover:text-white transition-colors">Narxlar</Link>
                            </>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <span className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                    Faol
                                </span>
                                <Link to="/dashboard" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-emerald-500/30">
                                    Panelim
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="text-slate-300 hover:text-white border border-white/20 hover:border-white/40 px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Chiqish
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-medium">Kirish</Link>
                                <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-emerald-500/30">
                                    Boshlash
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
