import { LIFE_AREAS } from '../../constants/lifeAreas';

function accentClass(key) {
  return {
    health: 'from-emerald-500/25 to-lime-500/10 border-emerald-400/20',
    learning: 'from-cyan-500/25 to-sky-500/10 border-cyan-400/20',
    finance: 'from-amber-500/25 to-orange-500/10 border-amber-400/20',
    personal: 'from-violet-500/25 to-fuchsia-500/10 border-violet-400/20',
  }[key] || 'from-white/10 to-white/5 border-white/10';
}

export default function LifeAreaGrid({ items = [] }) {
  const merged = LIFE_AREAS.map((area) => ({
    ...area,
    ...(items.find((item) => item.key === area.value) || {}),
  }));

  return (
    <div className="glass rounded-2xl p-6 space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Hayot Yo'nalishlari</h2>
        <p className="text-slate-400 text-sm">Kuningiz qaysi sohalarda oldinga siljiyotganini kuzating.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {merged.map((area) => (
          <div
            key={area.value}
            className={`rounded-2xl border p-4 bg-gradient-to-br ${accentClass(area.value)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{area.icon}</span>
              <span className="text-xs text-slate-300">{area.completion_rate || 0}%</span>
            </div>
            <h3 className="text-white font-semibold">{area.label}</h3>
            <p className="text-slate-300 text-sm mt-1">
              {area.completed_plans || 0}/{area.total_plans || 0} bajarildi
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
              <span>Energiya {area.average_energy || 0}</span>
              <span>{area.focus_minutes || 0} daq</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
