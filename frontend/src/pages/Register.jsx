import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await api.post('auth/register/', { username, email, password });
            const loginRes = await api.post('auth/login/', { username, password });
            localStorage.setItem('access_token', loginRes.data.access);
            localStorage.setItem('refresh_token', loginRes.data.refresh);
            navigate('/dashboard');
        } catch (err) {
            setError("Ro'yxatdan o'tishda xatolik. Bu foydalanuvchi nomi band bo'lishi mumkin.");
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <div className="glass w-full max-w-md p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-white mb-2 text-center">LIFEPAUSE'ga qo'shiling</h2>
                <p className="text-slate-400 text-center mb-8">Bugundan energiyangizni boshqaring.</p>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-5">
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
                        <label className="block text-sm font-medium text-slate-300 mb-1">Elektron pochta</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/25"
                    >
                        Hisob yaratish
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-400">
                    Hisobingiz bormi? <Link to="/login" className="text-emerald-400 hover:text-emerald-300">Kirish</Link>
                </p>
            </div>
        </div>
    );
}
