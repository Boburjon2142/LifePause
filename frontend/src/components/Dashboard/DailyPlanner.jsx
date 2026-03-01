import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function formatMinutes(seconds) {
    return Math.round((seconds || 0) / 60);
}

export default function DailyPlanner() {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [newTitle, setNewTitle] = useState('');

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await api.get('planning/plans/');
            setPlans(res.data);
        } catch (err) {
            console.error("Rejalarni olishda xato", err);
        }
    };

    const addPlan = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            const start = new Date();
            const end = new Date(start.getTime() + 60 * 60 * 1000);

            const res = await api.post('planning/plans/', {
                title: newTitle,
                start_time: start.toISOString(),
                end_time: end.toISOString(),
            });
            setPlans([...plans, res.data]);
            setNewTitle('');
        } catch (err) {
            console.error("Reja qo'shishda xato", err);
        }
    };

    const toggleComplete = async (plan) => {
        try {
            const res = await api.patch(`planning/plans/${plan.id}/`, {
                completed: !plan.completed
            });
            setPlans(plans.map(p => p.id === plan.id ? res.data : p));
        } catch (err) {
            console.error("Rejani yangilashda xato", err);
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={addPlan} className="flex gap-2">
                <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Bugun nima qilish kerak?"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                    Qo'shish
                </button>
            </form>

            <div className="space-y-2 mt-6">
                {plans.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">Hali vazifalar yo'q. Rejani boshlang!</p>
                ) : (
                    plans.map(plan => (
                        <div
                            key={plan.id}
                            className={`p-4 rounded-xl border transition-all ${plan.completed
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                                    : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => toggleComplete(plan)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${plan.completed ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500'
                                        }`}
                                >
                                    {plan.completed && (
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                                <span className={`flex-1 font-medium ${plan.completed ? 'line-through opacity-70' : ''}`}>
                                    {plan.title}
                                </span>
                                <span className="text-sm text-slate-400">
                                    {formatMinutes(plan.focus_seconds)} daq
                                </span>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/focus/${plan.id}`)}
                                    className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium"
                                >
                                    Diqqat Taymeri
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
