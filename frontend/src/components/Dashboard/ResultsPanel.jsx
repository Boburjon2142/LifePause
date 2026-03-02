function isPastDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const target = new Date(y, (m || 1) - 1, d || 1);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return target < today;
}

export default function ResultsPanel({ results = [] }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-5">Natijalarim</h2>

      {results.length === 0 ? (
        <p className="text-slate-500">Kunlik natijalar hali shakllanmagan.</p>
      ) : (
        <div className="space-y-4 max-h-[420px] overflow-auto pr-1">
          {results.map((day) => {
            const isPastDay = isPastDate(day.date);
            return (
            <div
              key={day.date}
              className={`rounded-xl p-4 border ${isPastDay && day.completed_plans < day.total_plans
                ? 'bg-red-500/10 border-red-400/30'
                : 'bg-white/5 border-white/10'
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-semibold">{day.date}</span>
                <span className="text-emerald-300 text-sm">{day.completed_plans}/{day.total_plans} bajarildi</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div className="text-slate-300">Diqqat: <span className="text-white">{day.focus_minutes} daq</span></div>
                <div className="text-slate-300">Energiya: <span className="text-white">{day.average_energy}</span></div>
                <div className="text-slate-300">Diqqat darajasi: <span className="text-white">{day.average_focus}</span></div>
                <div className="text-slate-300">Zo'riqish: <span className="text-white">{day.average_stress}</span></div>
              </div>

              <div className="space-y-1">
                {day.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between text-xs">
                    <span
                      className={
                        task.completed
                          ? 'text-emerald-300'
                          : isPastDay
                            ? 'text-red-300'
                            : 'text-slate-300'
                      }
                    >
                      {task.title}
                    </span>
                    <span className="text-slate-400">{task.focus_minutes} daq</span>
                  </div>
                ))}
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
}
