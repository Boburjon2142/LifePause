export default function EnergySummary({ evaluation, aiRecommendation }) {
    const energy = evaluation?.average_energy || 0;
    const burnoutRisk = evaluation?.burnout_risk || "Noma'lum";
    const productivityScore = evaluation?.productivity_score || 0;

    return (
        <div className="glass rounded-2xl p-6 space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Energiya Ko'rsatkichlari</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <span className="text-sm text-slate-400 block mb-1">O'rtacha Energiya</span>
                        <div className="text-2xl font-bold text-white flex items-end gap-1">
                            {energy} <span className="text-sm font-normal text-slate-500 mb-1">/ 5</span>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <span className="text-sm text-slate-400 block mb-1">Charchash Xavfi</span>
                        <div className={`text-xl font-bold ${burnoutRisk === 'Yuqori' ? 'text-red-400' :
                                burnoutRisk === "O'rta" ? 'text-yellow-400' : 'text-emerald-400'
                            }`}>
                            {burnoutRisk}
                        </div>
                    </div>

                    <div className="col-span-2 bg-white/5 rounded-xl p-4 border border-white/10">
                        <span className="text-sm text-slate-400 block mb-1">Samaradorlik Foizi</span>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                                    style={{ width: `${productivityScore}%` }}
                                />
                            </div>
                            <span className="text-white font-bold">{productivityScore}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {aiRecommendation?.recommendation && (
                <div className="pt-6 border-t border-white/10">
                    <h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        SI Tavsiyasi
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        {aiRecommendation.recommendation}
                    </p>
                </div>
            )}
        </div>
    );
}
