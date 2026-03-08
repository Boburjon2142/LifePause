import { useEffect, useState } from 'react';
import api from '../services/api';
import { GOAL_HORIZONS } from '../constants/lifeAreas';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [saving, setSaving] = useState('');

  useEffect(() => {
    api.get('analytics/future-goals/').then((res) => setGoals(res.data || [])).catch(console.error);
  }, []);

  const handleSave = async (event, horizon) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      horizon,
      title: formData.get('title'),
      description: formData.get('description'),
    };
    setSaving(horizon);
    try {
      const existing = goals.find((item) => item.horizon === horizon);
      const res = existing
        ? await api.patch(`analytics/future-goals/${existing.id}/`, payload)
        : await api.post('analytics/future-goals/', payload);
      setGoals((prev) => {
        const other = prev.filter((item) => item.horizon !== horizon);
        return [...other, res.data];
      });
    } catch (error) {
      console.error("Maqsadni saqlashda xato", error);
    } finally {
      setSaving('');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Kelajakdagi Men</h1>
        <p className="text-slate-400">Qisqa va uzoq muddatli identitetingizni rejalarga ulang.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        {GOAL_HORIZONS.map((horizon) => {
          const goal = goals.find((item) => item.horizon === horizon.value);
          return (
            <form
              key={`${horizon.value}-${goal?.id || 'new'}-${goal?.updated_at || 'base'}`}
              onSubmit={(event) => handleSave(event, horizon.value)}
              className="glass rounded-2xl p-6 space-y-4"
            >
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-400">{horizon.subtitle}</div>
                <h2 className="text-xl font-semibold text-white mt-1">{horizon.label}</h2>
              </div>
              <input
                name="title"
                defaultValue={goal?.title || ''}
                placeholder="Bu vaqt oralig'ida qanday odam bo'lishni xohlaysiz?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500"
              />
              <textarea
                name="description"
                rows="4"
                defaultValue={goal?.description || ''}
                placeholder="Niyat, odat va ichki o'sish yo'nalishini yozing..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={saving === horizon.value}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold"
              >
                {saving === horizon.value ? 'Saqlanmoqda...' : 'Maqsadni saqlash'}
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
