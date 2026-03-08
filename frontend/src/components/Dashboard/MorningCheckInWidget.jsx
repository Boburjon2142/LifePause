export default function MorningCheckInWidget({ snapshot, onSave, saving }) {
  const form = snapshot?.morning_checkin || {};

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-semibold text-white">Tonggi Yo'nalish</h2>
          <p className="text-slate-400 text-sm">Bugunning markazini aniqlang va energiyangizni sozlang.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 text-xs border border-white/10">
          3 savol
        </span>
      </div>

      <form className="space-y-4" onSubmit={onSave}>
        <input
          name="main_focus"
          defaultValue={form.main_focus || ''}
          placeholder="Bugungi asosiy fokusim..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500"
        />
        <input
          name="priority_habit"
          defaultValue={form.priority_habit || ''}
          placeholder="Bugun eng muhim bo'lgan odat yoki reja..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500"
        />
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  name="energy_level"
                  value={value}
                  defaultChecked={Number(form.energy_level || 3) === value}
                  className="sr-only peer"
                />
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-400">
                  {value}
                </span>
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold"
          >
            {saving ? "Saqlanmoqda..." : "Tongni saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}
