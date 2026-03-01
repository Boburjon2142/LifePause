import { useEffect, useState } from 'react';
import api from '../services/api';

export default function RecurringPlans() {
  const [recurringPlans, setRecurringPlans] = useState([]);
  const [recurringTitle, setRecurringTitle] = useState('');
  const [recurringTime, setRecurringTime] = useState('09:00');
  const [recurringDuration, setRecurringDuration] = useState(60);

  useEffect(() => {
    fetchRecurringPlans();
  }, []);

  const fetchRecurringPlans = async () => {
    try {
      const res = await api.get('planning/recurring-plans/');
      setRecurringPlans(res.data);
    } catch (err) {
      console.error("Takrorlanuvchi rejalarni olishda xato", err);
    }
  };

  const addRecurringPlan = async (e) => {
    e.preventDefault();
    if (!recurringTitle.trim()) return;

    try {
      await api.post('planning/recurring-plans/', {
        title: recurringTitle,
        start_time: recurringTime,
        duration_minutes: Number(recurringDuration),
        is_active: true,
      });
      setRecurringTitle('');
      await fetchRecurringPlans();
    } catch (err) {
      console.error("Takrorlanuvchi reja qo'shishda xato", err);
    }
  };

  const toggleRecurring = async (item) => {
    try {
      const res = await api.patch(`planning/recurring-plans/${item.id}/`, {
        is_active: !item.is_active,
      });
      setRecurringPlans(recurringPlans.map((p) => (p.id === item.id ? res.data : p)));
    } catch (err) {
      console.error("Takrorlanuvchi rejani yangilashda xato", err);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Kunlik takrorlanuvchi rejalar</h1>
        <p className="text-slate-400">Bu yerda har kuni avtomatik qo'shiladigan rejalarni boshqarasiz.</p>
      </header>

      <div className="glass rounded-2xl p-6 border border-white/10">
        <form onSubmit={addRecurringPlan} className="grid md:grid-cols-4 gap-2">
          <input
            type="text"
            value={recurringTitle}
            onChange={e => setRecurringTitle(e.target.value)}
            placeholder="Har kuni bajariladigan reja"
            className="md:col-span-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-slate-500"
          />
          <input
            type="time"
            value={recurringTime}
            onChange={e => setRecurringTime(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min="5"
              step="5"
              value={recurringDuration}
              onChange={e => setRecurringDuration(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              title="Daqiqa"
            />
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg">
              Qo'shish
            </button>
          </div>
        </form>

        <div className="mt-4 space-y-2">
          {recurringPlans.length === 0 ? (
            <p className="text-slate-500">Hali takrorlanuvchi reja yo'q.</p>
          ) : (
            recurringPlans.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <div className="text-slate-200">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-slate-400 ml-2">{item.start_time?.slice(0, 5)} | {item.duration_minutes} daq</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleRecurring(item)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${item.is_active ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40" : "bg-slate-500/20 text-slate-300 border border-slate-400/30"}`}
                >
                  {item.is_active ? "Faol" : "Nofaol"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
