import { motion } from 'framer-motion';

export default function ActivityTree({ evaluation }) {
    const energy = Number(evaluation?.average_energy || 0);
    const totalPlans = Number(evaluation?.total_plans || 0);
    const completedPlans = Number(evaluation?.completed_plans || 0);

    const completionRate = totalPlans > 0 ? completedPlans / totalPlans : 0;
    const canopyScale = 0.75 + completionRate * 0.55; // 0.75..1.30

    // Energy 1..5 oralig'ida barglar qizg'ishdan yashilga o'tadi.
    const normalizedEnergy = Math.max(0, Math.min(5, energy)) / 5;
    const hue = Math.round(15 + normalizedEnergy * 120); // 15 -> 135
    const saturation = 70;
    const lightness = 44;
    const canopyColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    let treeState = "Kuchsiz";
    if (completionRate >= 0.8 && energy >= 4) {
        treeState = "Yashnagan";
    } else if (completionRate >= 0.5 || energy >= 3) {
        treeState = "Yaxshi";
    } else if (completionRate > 0.2 || energy >= 2) {
        treeState = "O'smoqda";
    }

    return (
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
            <div className="absolute top-4 left-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Faollik Daraxti</span>
            </div>

            <div className="relative flex flex-col items-center justify-center h-52 w-52 mt-2">
                <motion.div
                    animate={{ scale: canopyScale, y: [0, -2, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-36 h-36 rounded-full flex items-center justify-center"
                    style={{
                        background: `linear-gradient(160deg, ${canopyColor} 0%, ${canopyColor} 100%)`,
                        boxShadow: "0 0 28px rgba(16,185,129,0.25)",
                    }}
                >
                    <span className="text-white font-bold opacity-90">{treeState}</span>
                </motion.div>
            </div>

            <div className="mt-8 text-center text-slate-300">
                <p className="text-sm">
                    Daraxt balandligi: <strong>{completedPlans}/{totalPlans || 0}</strong> bajarilgan rejaga qarab o'sadi.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                    Energiya: {energy} / 5, holat: <strong>{treeState.toLowerCase()}</strong>.
                </p>
            </div>
        </div>
    );
}
