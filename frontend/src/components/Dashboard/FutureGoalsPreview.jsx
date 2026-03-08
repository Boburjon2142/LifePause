import { GOAL_HORIZONS } from '../../constants/lifeAreas';

export default function FutureGoalsPreview({ goals = [] }) {
  const mapped = GOAL_HORIZONS.map((item) => ({
    ...item,
    ...(goals.find((goal) => goal.horizon === item.value) || {}),
  }));

  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">Kelajakdagi Men</h2>
        <p className="text-slate-400 text-sm">Bugungi rejalaringizni uzoqroq identitet bilan ulang.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {mapped.map((goal) => (
          <div key={goal.value} className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">{goal.subtitle}</div>
            <div className="text-lg font-semibold text-white mt-1">{goal.label}</div>
            <p className="text-slate-200 mt-3">{goal.title || 'Hali yozilmagan'}</p>
            <p className="text-slate-400 text-sm mt-2">{goal.description || 'Bu davr uchun niyatingizni goals sahifasida yozing.'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
