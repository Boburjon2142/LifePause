import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('access_token')));
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setIsAuthenticated(Boolean(localStorage.getItem('access_token')));
        setMobileOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        setMobileOpen(false);
        navigate('/');
    };

    const mainLinks = isAuthenticated
        ? [
            { to: '/calendar', label: 'Kalendar' },
            { to: '/recurring-plans', label: 'Takrorlanuvchi rejalar' },
            { to: '/results', label: 'Natijalar' },
            { to: '/reflections', label: 'Refleksiya' },
            { to: '/goals', label: 'Maqsadlar' },
        ]
        : [
            { to: '/features', label: 'Imkoniyatlar' },
            { to: '/ai', label: 'SI' },
            { to: '/pricing', label: 'Narxlar' },
        ];

    return (
        <nav className="sticky top-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-3">
                    <div className="flex-shrink-0 flex items-center">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200 select-none cursor-default">
                            LIFEPAUSE
                        </span>
                    </div>

                    <div className="hidden md:flex md:items-center space-x-6">
                        {mainLinks.map((item) => (
                            <Link key={item.to} to={item.to} className="text-slate-300 hover:text-white transition-colors">
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
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

                    <div className="md:hidden flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMobileOpen((prev) => !prev)}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/20 text-slate-200 hover:bg-white/10"
                            aria-label="Menyu"
                        >
                            <span className="text-lg leading-none">{mobileOpen ? 'X' : '='}</span>
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <div className="md:hidden pb-4 border-t border-white/10">
                        <div className="pt-3 space-y-2">
                            {mainLinks.map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-white/10"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium"
                                    >
                                        Panelim
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="block w-full text-center text-slate-200 border border-white/20 hover:border-white/40 px-4 py-2 rounded-lg font-medium"
                                    >
                                        Chiqish
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block w-full text-center text-slate-200 border border-white/20 px-4 py-2 rounded-lg">
                                        Kirish
                                    </Link>
                                    <Link to="/register" className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium">
                                        Boshlash
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
