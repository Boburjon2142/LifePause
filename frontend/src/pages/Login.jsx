import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await api.post('auth/login/', { username, password });
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            navigate('/dashboard');
        } catch (err) {
            setError("Foydalanuvchi nomi yoki parol noto'g'ri");
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <div className="glass w-full max-w-md p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Qaytganingiz bilan</h2>
                <p className="text-slate-400 text-center mb-8">Energiyangizni boshqarish uchun tizimga kiring.</p>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Foydalanuvchi nomi</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Parol</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/25 relative overflow-hidden group"
                    >
                        <span className="relative z-10">Kirish</span>
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-400">
                    Hisobingiz yo'qmi? <Link to="/register" className="text-emerald-400 hover:text-emerald-300">Ro'yxatdan o'tish</Link>
                </p>
            </div>
        </div>
    );
}
