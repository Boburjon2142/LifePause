import { Link } from 'react-router-dom';

const PRICING_PLANS = [
  {
    name: "FREE",
    price: "$0",
    period: "oyiga",
    badge: "Boshlang'ich",
    features: [
      "Asosiy kunlik reja boshqaruvi",
      "Vazifalar bo'yicha diqqat taymeri",
      "Kunlik energiya/diqqat/zo'riqish reytingi",
      "Faollik daraxti va asosiy progress ko'rinishi",
      "Cheklangan SI tavsiyalari (matnli)",
    ],
    cta: "Bepul boshlash",
    ctaLink: "/register",
    highlight: false,
  },
  {
    name: "PRO (B2C)",
    price: "$10",
    period: "oyiga",
    badge: "Eng mashhur",
    features: [
      "FREE paketdagi barcha imkoniyatlar",
      "Kengaytirilgan SI tavsiyalari va chuqur tahlil",
      "Haftalik va oylik natijalar bo'yicha to'liq hisobot",
      "Kalendar heatmap bo'yicha to'liq tarix",
      "Kengaytirilgan rejalashtirish va tahlil",
    ],
    cta: "PRO'ga o'tish",
    ctaLink: "/register",
    highlight: true,
  },
  {
    name: "CORPORATIV",
    price: "$10",
    period: "har bir xodim / oyiga",
    badge: "Jamoalar uchun",
    features: [
      "PRO paketdagi barcha imkoniyatlar",
      "Jamoa va bo'limlar bo'yicha umumiy ko'rsatkichlar",
      "Xodimlar kesimida samaradorlik monitoringi",
      "Admin uchun markazlashgan boshqaruv paneli",
      "Markazlashgan rejalashtirish va nazorat",
      "Prioritet qo'llab-quvvatlash",
    ],
    cta: "Corporativ ulanish",
    ctaLink: "/register",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-extrabold text-white">Narxlar rejalari</h1>
        <p className="text-slate-300 mt-3">
          O'zingizga mos tarifni tanlang: individual foydalanish uchun FREE yoki PRO, jamoa uchun CORPORATIV.
        </p>
      </header>

      <section className="grid lg:grid-cols-3 gap-6">
        {PRICING_PLANS.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-2xl p-6 border ${plan.highlight
              ? "bg-emerald-500/10 border-emerald-400/40 shadow-lg shadow-emerald-500/20"
              : "glass border-white/10"
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-white">{plan.name}</h2>
              <span className={`text-xs px-2 py-1 rounded-full ${plan.highlight ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-300"}`}>
                {plan.badge}
              </span>
            </div>

            <div className="mb-5">
              <p className="text-4xl font-black text-white">{plan.price}</p>
              <p className="text-sm text-slate-400">{plan.period}</p>
            </div>

            <div className="space-y-2 mb-6">
              {plan.features.map((feature) => (
                <p key={feature} className="text-slate-200 text-sm flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{feature}</span>
                </p>
              ))}
            </div>

            <Link
              to={plan.ctaLink}
              className={`inline-flex w-full justify-center px-4 py-3 rounded-xl font-semibold transition-colors ${plan.highlight
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
