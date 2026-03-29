import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { LIFE_AREAS, STICKERS } from '../../constants/lifeAreas';

function formatMinutes(seconds) {
    return Math.round((seconds || 0) / 60);
}

function formatTimeLabel(isoDateTime) {
    if (!isoDateTime) return '--:--';
    const date = new Date(isoDateTime);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function parseTimeFromTitle(rawText) {
    const text = (rawText || '').trim();
    if (!text) return { cleanedTitle: '', parsedTime: null };

    const match = text.match(/\bsoat\s+(\d{1,2})(?:\s*[:.\- ]\s*(\d{1,2}))?/i);
    if (!match) {
        return { cleanedTitle: text, parsedTime: null };
    }

    const h = Number(match[1]);
    const m = match[2] !== undefined ? Number(match[2]) : 0;
    if (Number.isNaN(h) || Number.isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
        return { cleanedTitle: text, parsedTime: null };
    }

    const parsedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const cleanedTitle = text
        .replace(match[0], ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return { cleanedTitle, parsedTime };
}

export default function DailyPlanner() {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [startAt, setStartAt] = useState(() => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    });
    const [lifeArea, setLifeArea] = useState('personal');
    const [sticker, setSticker] = useState('🧘');

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
        const { cleanedTitle, parsedTime } = parseTimeFromTitle(newTitle);
        const titleToSave = cleanedTitle.trim();
        if (parsedTime) setStartAt(parsedTime);
        if (!titleToSave) return;

        try {
            const [h, m] = (parsedTime || startAt).split(':').map(Number);
            const start = new Date();
            start.setHours(h || 0, m || 0, 0, 0);
            const end = new Date(start.getTime() + 60 * 60 * 1000);

            const res = await api.post('planning/plans/', {
                title: titleToSave,
                life_area: lifeArea,
                sticker,
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
            setPlans(plans.map((p) => (p.id === plan.id ? res.data : p)));
        } catch (err) {
            console.error("Rejani yangilashda xato", err);
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={addPlan} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Bugun nima qilish kerak?"
                    className="w-full sm:flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <input
                    type="time"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    className="w-full sm:w-auto bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    title="Boshlanish vaqti"
                />
                <button
                    type="submit"
                    className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                    Qo'shish
                </button>
            </form>

            <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex flex-wrap gap-2">
                    {LIFE_AREAS.map((area) => (
                        <button
                            key={area.value}
                            type="button"
                            onClick={() => setLifeArea(area.value)}
                            className={`px-3 py-2 rounded-lg border text-sm ${lifeArea === area.value ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' : 'bg-white/5 border-white/10 text-slate-300'}`}
                        >
                            {area.icon} {area.label}
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                    {STICKERS.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setSticker(item)}
                            className={`w-10 h-10 rounded-lg border text-lg ${sticker === item ? 'bg-violet-500/20 border-violet-400/40' : 'bg-white/5 border-white/10'}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2 mt-6">
                {plans.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">Hali vazifalar yo'q. Rejani boshlang!</p>
                ) : (
                    plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`p-4 rounded-xl border transition-all ${plan.completed
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                                : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
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
                                <div className="w-full min-w-0 sm:flex-1">
                                    <span className={`block font-medium break-words ${plan.completed ? 'line-through opacity-70' : ''}`}>
                                        {plan.sticker ? `${plan.sticker} ` : ''}{plan.title}
                                    </span>
                                    <span className="text-xs text-slate-400 mt-1 capitalize">{plan.life_area}</span>
                                </div>
                                <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                                    <span className="text-sm text-slate-400">
                                        {formatTimeLabel(plan.start_time)}
                                    </span>
                                    <span className="text-sm text-slate-400">
                                        {formatMinutes(plan.focus_seconds)} daq
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/focus/${plan.id}`)}
                                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium"
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
