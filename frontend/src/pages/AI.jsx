import { Link } from 'react-router-dom';

const AI_FEATURES = [
  {
    title: "Kunlik holatni tahlil qilish",
    desc: "Kun davomida kiritilgan energiya, diqqat va zo'riqish ko'rsatkichlarini tahlil qilib, real holatni chiqaradi.",
  },
  {
    title: "Charchash xavfini baholash",
    desc: "Ish hajmi va energiya pasayishi asosida charchash xavfini Past, O'rta yoki Yuqori darajada baholaydi.",
  },
  {
    title: "Shaxsiy tavsiyalar",
    desc: "Sizning kunlik natijalaringizga qarab tanaffus, ustuvor vazifalar va ish ritmi bo'yicha tavsiya beradi.",
  },
  {
    title: "Reja optimizatsiyasi",
    desc: "Qaysi vazifalarni ertaroq bajarish, qaysilarini keyinga surish kerakligini aniqlashga yordam beradi.",
  },
  {
    title: "Produktivlik trendini ko'rsatish",
    desc: "Kunlar kesimida samaradorlikdagi o'sish yoki pasayishni ko'rsatib, odatlarni yaxshilashga yo'l ochadi.",
  },
  {
    title: "Fokus vaqtini tahlil qilish",
    desc: "Vazifalarga sarflangan vaqtni solishtirib, qaysi ishlar sizni ko'proq chalg'itayotganini topishga yordam beradi.",
  },
];

export default function AI() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-extrabold text-white">Sun'iy Intellekt imkoniyatlari</h1>
        <p className="text-slate-300 mt-3">
          LifePause'dagi SI moduli sizning kundalik faoliyatingizni tahlil qilib, energiyani to'g'ri boshqarish va unumdorlikni oshirishga yordam beradi.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        {AI_FEATURES.map((item) => (
          <article key={item.title} className="glass rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-2">{item.title}</h2>
            <p className="text-slate-300 leading-relaxed">{item.desc}</p>
          </article>
        ))}
      </section>

      <section className="glass rounded-2xl p-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">SI yordamida kuningizni kuchaytiring</h3>
          <p className="text-slate-300">Kirish qiling va shaxsiy tavsiyalarni darhol sinab ko'ring.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
            Kirish
          </Link>
          <Link to="/register" className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20">
            Boshlash
          </Link>
        </div>
      </section>
    </div>
  );
}
