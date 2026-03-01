export default function ProgressChart({ progressData = [] }) {
  const maxScore = 100;
  const dayLabels = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];

  const formatted = progressData.map((day) => {
    const date = new Date(`${day.date}T00:00:00`);
    return {
      ...day,
      dayName: dayLabels[date.getDay()],
      label: `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}`,
    };
  });

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-5">Haftalik O'sish</h2>
      {formatted.length === 0 ? (
        <p className="text-slate-500">O'sish bo'yicha ma'lumotlar hali yo'q.</p>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-7 gap-2 items-end min-h-[180px]">
            {formatted.map((day) => (
              <div key={day.date} className="flex flex-col items-center gap-2">
                <div className="w-full h-36 bg-slate-900/70 border border-white/10 rounded-lg flex items-end overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500 to-cyan-400 rounded-b-lg transition-all duration-700"
                    style={{ height: `${(day.productivity_score / maxScore) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">{day.dayName}</p>
                <p className="text-[11px] text-slate-500">{day.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {formatted.map((day) => (
              <p key={`${day.date}-meta`} className="text-xs text-slate-400">
                {day.label}: Bajarildi {day.completed_plans}/{day.total_plans}, diqqat {day.focus_minutes} daq, energiya {day.average_energy}, samaradorlik {day.productivity_score}%
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
