export default function ReflectionCard({ snapshot, onSave, saving }) {
  const prompt = snapshot?.reflection_prompt || "Bugun nimalar yaxshi ketdi?";
  const latest = snapshot?.latest_reflection || {};

  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">Kechki Refleksiya</h2>
        <p className="text-slate-400 text-sm">{prompt}</p>
      </div>

      <form className="space-y-4" onSubmit={onSave}>
        <input type="hidden" name="prompt" value={prompt} />
        <div className="flex gap-2">
          {['Tinch', 'Minnatdor', 'Charchoq', 'Ilhom'].map((mood) => (
            <label key={mood} className="cursor-pointer">
              <input
                type="radio"
                name="mood"
                value={mood}
                defaultChecked={latest.mood === mood}
                className="sr-only peer"
              />
              <span className="inline-flex px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-slate-300 text-sm peer-checked:bg-violet-500 peer-checked:text-white peer-checked:border-violet-400">
                {mood}
              </span>
            </label>
          ))}
        </div>
        <textarea
          name="response"
          rows="4"
          defaultValue={latest.date === new Date().toISOString().slice(0, 10) ? latest.response : ''}
          placeholder="Bugungi kichik yutuq, saboq yoki ertangi niyat..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-60 text-white font-semibold"
        >
          {saving ? "Saqlanmoqda..." : "Refleksiyani saqlash"}
        </button>
      </form>
    </div>
  );
}
