import { useEffect, useState } from 'react';
import api from '../services/api';

const MOODS = ['Tinch', 'Minnatdor', 'Ilhom', 'Charchoq'];

export default function Reflections() {
  const [snapshot, setSnapshot] = useState(null);
  const [reflections, setReflections] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('analytics/growth-snapshot/').then((res) => setSnapshot(res.data)).catch(console.error);
    api.get('analytics/reflections/').then((res) => setReflections(res.data || [])).catch(console.error);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      prompt: form.get('prompt'),
      mood: form.get('mood'),
      response: form.get('response'),
    };
    setSaving(true);
    try {
      const existing = reflections.find((item) => item.date === new Date().toISOString().slice(0, 10));
      const res = existing
        ? await api.patch(`analytics/reflections/${existing.id}/`, payload)
        : await api.post('analytics/reflections/', payload);
      setReflections((prev) => [res.data, ...prev.filter((item) => item.id !== res.data.id)]);
    } catch (error) {
      console.error("Refleksiya saqlanmadi", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Kechki Refleksiya</h1>
        <p className="text-slate-400">Kunni yakunlashdan oldin kichik mulohaza qoldiring.</p>
      </header>

      <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-6">
        <form key={`${snapshot?.latest_reflection?.date || 'new'}-${snapshot?.latest_reflection?.mood || 'none'}`} onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
          <p className="text-emerald-300 text-sm">{snapshot?.reflection_prompt || "Bugun nimalar yaxshi ketdi?"}</p>
          <input type="hidden" name="prompt" value={snapshot?.reflection_prompt || "Bugun nimalar yaxshi ketdi?"} />
          <div className="flex flex-wrap gap-2">
            {MOODS.map((mood) => (
              <label key={mood} className="cursor-pointer">
                <input type="radio" name="mood" value={mood} className="sr-only peer" defaultChecked={snapshot?.latest_reflection?.mood === mood} />
                <span className="inline-flex px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-slate-300 text-sm peer-checked:bg-violet-500 peer-checked:text-white">
                  {mood}
                </span>
              </label>
            ))}
          </div>
          <textarea
            name="response"
            rows="7"
            placeholder="Bugungi kichik g'alaba, saboq yoki ertangi niyatingiz..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500"
          />
          <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-60 text-white font-semibold">
            {saving ? 'Saqlanmoqda...' : 'Refleksiyani saqlash'}
          </button>
        </form>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Saqlangan Mulohazalar</h2>
          <div className="space-y-3 max-h-[520px] overflow-auto pr-1">
            {reflections.length === 0 ? (
              <p className="text-slate-500">Hali refleksiya yozilmagan.</p>
            ) : (
              reflections.map((item) => (
                <div key={item.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white font-medium">{item.date}</span>
                    <span className="text-violet-300">{item.mood || 'Holat yo‘q'}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{item.prompt}</p>
                  <p className="text-slate-200 mt-2">{item.response}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
