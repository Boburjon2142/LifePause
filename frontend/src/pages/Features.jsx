import { Link } from 'react-router-dom';

const FEATURES = [
  {
    title: "Kunlik Rejalashtirish",
    desc: "Bugungi vazifalarni qo'shing, bajarilganlarini belgilab boring va ish tartibini nazorat qiling.",
  },
  {
    title: "Diqqat Taymeri",
    desc: "Har bir vazifa uchun alohida taymer ochiladi. Sarflangan vaqt vazifaga bog'lanib saqlanadi.",
  },
  {
    title: "Energiya Reytingi",
    desc: "Sessiya oxirida energiya, diqqat va zo'riqish ko'rsatkichlarini 1-5 oralig'ida baholaysiz.",
  },
  {
    title: "Faollik Daraxti",
    desc: "Daraxt holati kunlik bajarilgan rejalar va energiya darajasi asosida dinamik o'zgaradi.",
  },
  {
    title: "Kalendar Issiqlik Xarita",
    desc: "Kalendar kunlari bajarilgan reja foiziga qarab qizildan yashilgacha bo'yaladi va tarix saqlanadi.",
  },
  {
    title: "Natijalarim Oynasi",
    desc: "Kunlar bo'yicha bajarilgan vazifalar, sarflangan vaqt, energiya, diqqat va zo'riqish tahlili ko'rsatiladi.",
  },
  {
    title: "Haftalik Progress Diagramma",
    desc: "Kunlik samaradorlik foizi ustunli ko'rinishda aks etadi, o'sish dinamikasi ko'rinadi.",
  },
  {
    title: "SI Tavsiyalari",
    desc: "Joriy holatingizga qarab charchash xavfi va ish tartibini yaxshilash bo'yicha tavsiyalar beriladi.",
  },
];

export default function Features() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-extrabold text-white">LifePause imkoniyatlari</h1>
        <p className="text-slate-300 mt-3">
          Platforma kunlik produktivlik, energiya va fokusni bitta joyda boshqarish uchun quyidagi imkoniyatlarni taqdim etadi.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        {FEATURES.map((item) => (
          <article key={item.title} className="glass rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-2">{item.title}</h2>
            <p className="text-slate-300 leading-relaxed">{item.desc}</p>
          </article>
        ))}
      </section>

      <section className="glass rounded-2xl p-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">Darhol sinab ko'ring</h3>
          <p className="text-slate-300">Ro'yxatdan o'ting va kundalik rejalarni boshqarishni boshlang.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/register" className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
            Boshlash
          </Link>
          <Link to="/login" className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20">
            Kirish
          </Link>
        </div>
      </section>
    </div>
  );
}
