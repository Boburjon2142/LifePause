import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const WEEK_DAYS = ["Dush", "Sesh", "Chor", "Pay", "Jum", "Shan", "Yak"];
const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];

function isoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function colorByProductivity(score) {
  const clamped = Math.max(0, Math.min(100, Number(score || 0)));
  const hue = Math.round((clamped / 100) * 120); // 0 red -> 120 green
  return `hsl(${hue}, 75%, 42%)`;
}

export default function Calendar() {
  const [progressData, setProgressData] = useState([]);
  const [resultsData, setResultsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => isoDate(new Date()));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMonth, setActiveMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    api.get("analytics/progress/?days=366")
      .then((res) => setProgressData(res.data || []))
      .catch(console.error);
    api.get("analytics/results/?days=366")
      .then((res) => setResultsData(res.data || []))
      .catch(console.error);
  }, []);

  const progressByDate = useMemo(() => {
    const map = {};
    for (const day of progressData) {
      map[day.date] = day;
    }
    return map;
  }, [progressData]);

  const monthCells = useMemo(() => {
    const year = activeMonth.getFullYear();
    const month = activeMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0).getDate();
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday-based

    const cells = [];
    for (let i = 0; i < startOffset; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= lastDate; day += 1) {
      const date = new Date(year, month, day);
      const key = isoDate(date);
      cells.push({
        date,
        key,
        data: progressByDate[key] || null,
      });
    }
    return cells;
  }, [activeMonth, progressByDate]);

  const resultsByDate = useMemo(() => {
    const map = {};
    for (const day of resultsData) {
      map[day.date] = day;
    }
    return map;
  }, [resultsData]);

  const selectedDay = resultsByDate[selectedDate] || null;
  const completedTasks = (selectedDay?.tasks || []).filter((task) => task.completed);

  useEffect(() => {
    if (!isModalOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Kalendar</h1>
          <p className="text-slate-400">Kunlar ranggi bajarilgan rejalarga qarab saqlanadi: qizildan yashilgacha.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMonth(new Date(activeMonth.getFullYear(), activeMonth.getMonth() - 1, 1))}
            className="px-3 py-2 rounded-lg bg-white/10 text-slate-200 hover:bg-white/20"
          >
            Oldingi
          </button>
          <button
            type="button"
            onClick={() => setActiveMonth(new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 1))}
            className="px-3 py-2 rounded-lg bg-white/10 text-slate-200 hover:bg-white/20"
          >
            Keyingi
          </button>
        </div>
      </header>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          {MONTHS[activeMonth.getMonth()]} {activeMonth.getFullYear()}
        </h2>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {WEEK_DAYS.map((d) => (
            <div key={d} className="text-xs uppercase tracking-wide text-slate-400 text-center py-2">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {monthCells.map((cell, idx) => {
            if (!cell) {
              return <div key={`empty-${idx}`} className="h-20 rounded-lg bg-white/0" />;
            }
            const score = cell.data?.productivity_score ?? 0;
            const bg = cell.data ? colorByProductivity(score) : "rgba(255,255,255,0.04)";

            return (
              <div
                key={cell.key}
                className={`h-20 rounded-lg border p-2 text-white cursor-pointer transition-all ${selectedDate === cell.key ? "border-emerald-300 ring-2 ring-emerald-400/50" : "border-white/10 hover:border-white/30"}`}
                style={{ backgroundColor: bg }}
                onClick={() => {
                  setSelectedDate(cell.key);
                  setIsModalOpen(true);
                }}
                title={cell.data
                  ? `${cell.key}: ${score}% (${cell.data.completed_plans}/${cell.data.total_plans})`
                  : `${cell.key}: ma'lumot yo'q`}
              >
                <div className="text-sm font-semibold">{cell.date.getDate()}</div>
                <div className="text-[11px] opacity-90 mt-1">
                  {cell.data ? `${cell.data.completed_plans}/${cell.data.total_plans}` : "-"}
                </div>
                <div className="text-[11px] opacity-90">
                  {cell.data ? `${score}%` : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-3xl glass rounded-2xl p-6 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">{selectedDate} kuni bajarilgan ishlar</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Shu sana bo'yicha yakunlangan vazifalar ro'yxati.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200"
              >
                Yopish
              </button>
            </div>

            <div className="mt-5 space-y-2 max-h-[50vh] overflow-auto pr-1">
              {completedTasks.length === 0 ? (
                <p className="text-slate-500">Bu kunda bajarilgan vazifalar topilmadi.</p>
              ) : (
                completedTasks.map((task) => (
                  <div key={task.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-slate-100">{task.title}</span>
                    <span className="text-emerald-300 text-sm">{task.focus_minutes} daq</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
