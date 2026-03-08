import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LIFE_AREAS } from '../constants/lifeAreas';

const pillars = [
  { title: 'Fokus', desc: 'Kunlik reja, taymer va deep work ritmini bitta oqimda boshqaring.' },
  { title: 'Energiya', desc: "Diqqat, energiya va zo'riqishni baholab, ritmingizni yo'qotmang." },
  { title: 'Ritm', desc: 'Takrorlanuvchi rejalar va eslatmalar bilan barqaror tizim yarating.' },
  { title: 'Refleksiya', desc: 'Kun yakunida kichik mulohaza va kelajakdagi men uchun niyat qoldiring.' },
];

export default function Home() {
  return (
    <div className="space-y-16 md:space-y-24 py-6 md:py-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-14 md:px-12 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.18),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.18),_transparent_30%)]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 text-sm">
            Calm performance platform
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight text-white">
            Energiyangizni boshqaring,
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300">
              kuningizni ongli yenging.
            </span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-2xl text-slate-300 leading-relaxed">
            LifePause kunlik reja, focus timer, energiya kuzatuvi, refleksiya va kelajakdagi identitetingizni bitta premium tizimga birlashtiradi.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-emerald-500/30"
            >
              Boshlash
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 glass hover:bg-white/20 text-white rounded-2xl font-semibold text-lg"
            >
              Kirish
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="grid lg:grid-cols-[1.2fr,0.8fr] gap-6">
        <div className="glass rounded-[2rem] p-6 md:p-8">
          <div className="grid sm:grid-cols-2 gap-4">
            {pillars.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="text-sm text-emerald-300">0{index + 1}</div>
                <h3 className="text-xl font-semibold text-white mt-2">{item.title}</h3>
                <p className="text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass rounded-[2rem] p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white">4 hayot yo'nalishi</h2>
          <p className="text-slate-400 mt-2">Har bir reja ma’noli soha bilan bog‘lanadi, progress esa rangli ko‘rinishda kuzatiladi.</p>
          <div className="mt-6 space-y-3">
            {LIFE_AREAS.map((area) => (
              <div key={area.value} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{area.icon}</span>
                  <span className="text-white font-medium">{area.label}</span>
                </div>
                <span className={`h-3 w-20 rounded-full bg-gradient-to-r ${area.accent}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="glass rounded-[2rem] p-6">
          <p className="text-slate-400 text-sm">Bugungi ritm</p>
          <div className="mt-4 text-4xl font-black text-white">Focus + Energy</div>
          <p className="text-slate-400 mt-3">Taymer, tanaffus eslatmalari va energiya baholash bitta oqimda ishlaydi.</p>
        </div>
        <div className="glass rounded-[2rem] p-6">
          <p className="text-slate-400 text-sm">Analytics</p>
          <div className="mt-4 text-4xl font-black text-white">7 kunlik progress</div>
          <p className="text-slate-400 mt-3">Kalendar, natijalar va hayot yo‘nalishlari bo‘yicha o‘sishni ko‘ring.</p>
        </div>
        <div className="glass rounded-[2rem] p-6">
          <p className="text-slate-400 text-sm">Identity growth</p>
          <div className="mt-4 text-4xl font-black text-white">Kelajakdagi men</div>
          <p className="text-slate-400 mt-3">1 kun, 1 hafta, 1 oy va 1 yil uchun niyatlarni reja bilan ulang.</p>
        </div>
      </section>
    </div>
  );
}
