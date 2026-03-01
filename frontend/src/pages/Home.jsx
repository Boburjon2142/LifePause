import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl"
            >
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                    <span className="text-white">Energiyangizni boshqaring,</span>
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                        kuningizni yengib oling.
                    </span>
                </h1>

                <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                    Sun'iy intellekt asosidagi shaxsiy energiya boshqaruv platformasi. Zo'riqishni kuzating, kunni rejalang va faoliyat daraxtingizni o'stiring.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/register"
                        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-1"
                    >
                        Boshlash
                    </Link>
                    <Link
                        to="/login"
                        className="px-8 py-4 glass hover:bg-white/20 text-white rounded-xl font-semibold text-lg transition-all"
                    >
                        Kirish
                    </Link>
                </div>
            </motion.div>

            {/* Feature cards preview */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid md:grid-cols-3 gap-6 mt-20 w-full"
            >
                {[
                    { title: "Kunlik Reja", desc: "Kuningizni bosqichma-bosqich tartiblang." },
                    { title: "Energiya So'rovi", desc: "Diqqat, stress va energiyani kuzating." },
                    { title: "SI Tavsiyalari", desc: "Charchashning oldini olish bo'yicha tavsiyalar oling." }
                ].map((feature, i) => (
                    <div key={i} className="glass p-6 rounded-2xl text-left hover:bg-white/15 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-slate-400">{feature.desc}</p>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
