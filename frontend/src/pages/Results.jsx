import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

function monthLabel(monthIndex) {
  const names = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
  ];
  return names[monthIndex] || '';
}

export default function Results() {
  const [results, setResults] = useState([]);
  const [openYear, setOpenYear] = useState(null);
  const [openMonth, setOpenMonth] = useState({});

  useEffect(() => {
    api.get('analytics/results/?days=1095')
      .then((res) => {
        const data = res.data || [];
        setResults(data);
        if (data.length > 0) {
          const [y] = data[0].date.split('-');
          setOpenYear(y);
        }
      })
      .catch(console.error);
  }, []);

  const grouped = useMemo(() => {
    const years = {};
    for (const day of results) {
      const [y, m] = day.date.split('-');
      if (!years[y]) years[y] = {};
      if (!years[y][m]) years[y][m] = [];
      years[y][m].push(day);
    }
    return years;
  }, [results]);

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Batafsil natijalar</h1>
        <p className="text-slate-400">Yil va oy tugmalarini bosib kunlik natijalarni oching.</p>
      </header>

      {years.length === 0 ? (
        <div className="glass rounded-2xl p-6 text-slate-400">Natijalar hali mavjud emas.</div>
      ) : (
        <div className="space-y-4">
          {years.map((year) => {
            const isYearOpen = openYear === year;
            const months = Object.keys(grouped[year]).sort((a, b) => Number(b) - Number(a));
            return (
              <div key={year} className="glass rounded-2xl p-4">
                <button
                  type="button"
                  onClick={() => setOpenYear(isYearOpen ? null : year)}
                  className="w-full flex items-center justify-between text-left px-2 py-2 rounded-lg hover:bg-white/5"
                >
                  <span className="text-xl font-bold text-white">{year} yil</span>
                  <span className="text-slate-300">{isYearOpen ? 'Yopish' : 'Ochish'}</span>
                </button>

                {isYearOpen && (
                  <div className="mt-3 space-y-3">
                    {months.map((month) => {
                      const key = `${year}-${month}`;
                      const isMonthOpen = openMonth[key] === true;
                      const days = grouped[year][month];
                      return (
                        <div key={key} className="bg-white/5 border border-white/10 rounded-xl p-3">
                          <button
                            type="button"
                            onClick={() => setOpenMonth((prev) => ({ ...prev, [key]: !isMonthOpen }))}
                            className="w-full flex items-center justify-between text-left"
                          >
                            <span className="text-white font-semibold">{monthLabel(Number(month) - 1)} oyi</span>
                            <span className="text-slate-300 text-sm">{isMonthOpen ? 'Yopish' : `Kunlar: ${days.length}`}</span>
                          </button>

                          {isMonthOpen && (
                            <div className="mt-3 space-y-2">
                              {days.map((day) => (
                                <div key={day.date} className="bg-white/5 border border-white/10 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-white font-semibold">{day.date}</span>
                                    <span className="text-emerald-300 text-sm">{day.completed_plans}/{day.total_plans} bajarildi</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <p className="text-slate-300">Diqqat: <span className="text-white">{day.focus_minutes} daq</span></p>
                                    <p className="text-slate-300">Energiya: <span className="text-white">{day.average_energy}</span></p>
                                    <p className="text-slate-300">Diqqat darajasi: <span className="text-white">{day.average_focus}</span></p>
                                    <p className="text-slate-300">Zo'riqish: <span className="text-white">{day.average_stress}</span></p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
