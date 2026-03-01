import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const TICK_SECONDS = 1;
const AUTO_SAVE_EVERY_SECONDS = 30;
const BREAK_INTERVAL_SECONDS = 20 * 60;

function formatTime(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return [hours, minutes, seconds].map((v) => String(v).padStart(2, '0')).join(':');
}

export default function FocusTimer() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(true);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [savedBaseSeconds, setSavedBaseSeconds] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [energy, setEnergy] = useState(3);
  const [focus, setFocus] = useState(3);
  const [stress, setStress] = useState(3);
  const [savingLog, setSavingLog] = useState(false);
  const [breakModalOpen, setBreakModalOpen] = useState(false);
  const [breakConfirmed, setBreakConfirmed] = useState(false);
  const [breakCheckpoint, setBreakCheckpoint] = useState(0);

  const speakBreakReminder = () => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance("Qisqa tanaffus qiling");
    utter.lang = "uz-UZ";
    utter.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    let mounted = true;
    api.get(`planning/plans/${planId}/`)
      .then((res) => {
        if (mounted) {
          setPlan(res.data);
          setSavedBaseSeconds(res.data.focus_seconds || 0);
          setBreakCheckpoint(Math.floor((res.data.focus_seconds || 0) / BREAK_INTERVAL_SECONDS));
        }
      })
      .catch(() => {
        setMessage("Vazifa topilmadi yoki ruxsat yo'q.");
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [planId]);

  useEffect(() => {
    if (!running) {
      return undefined;
    }
    const interval = setInterval(() => {
      setSessionSeconds((prev) => prev + TICK_SECONDS);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (!running || sessionSeconds <= 0 || sessionSeconds % AUTO_SAVE_EVERY_SECONDS !== 0) {
      return;
    }
    saveSession({ stopAfterSave: false, silent: true });
  }, [sessionSeconds, running]);

  const totalSeconds = useMemo(() => savedBaseSeconds + sessionSeconds, [savedBaseSeconds, sessionSeconds]);
  const timeParts = useMemo(() => formatTime(totalSeconds).split(':'), [totalSeconds]);

  useEffect(() => {
    if (!running || breakModalOpen) return;
    const currentCheckpoint = Math.floor(totalSeconds / BREAK_INTERVAL_SECONDS);
    if (currentCheckpoint > breakCheckpoint) {
      setRunning(false);
      setBreakModalOpen(true);
      setBreakConfirmed(false);
      setBreakCheckpoint(currentCheckpoint);
      speakBreakReminder();
    }
  }, [totalSeconds, running, breakModalOpen, breakCheckpoint]);

  const saveSession = async ({ stopAfterSave = true, silent = false } = {}) => {
    if (!plan || sessionSeconds <= 0 || saving) {
      if (stopAfterSave) {
        setRunning(false);
      }
      return;
    }

    setSaving(true);
    if (!silent) {
      setMessage('');
    }

    try {
      const nextFocusSeconds = savedBaseSeconds + sessionSeconds;
      const res = await api.patch(`planning/plans/${plan.id}/`, { focus_seconds: nextFocusSeconds });
      setPlan(res.data);
      setSavedBaseSeconds(res.data.focus_seconds || nextFocusSeconds);
      setSessionSeconds(0);
      if (stopAfterSave) {
        setRunning(false);
      }
      if (!silent) {
        setMessage("Taymer saqlandi.");
      }
    } catch {
      if (!silent) {
        setMessage("Taymerni saqlashda xato yuz berdi.");
      }
    } finally {
      setSaving(false);
    }
  };

  const saveRatingAndStopTimer = async (e) => {
    e.preventDefault();
    if (!plan) {
      return;
    }
    setSavingLog(true);
    setMessage('');
    try {
      await api.post('analytics/logs/', {
        plan: plan.id,
        energy: Number(energy),
        focus: Number(focus),
        stress: Number(stress),
      });
      await saveSession({ stopAfterSave: true, silent: true });
      setRunning(false);
      navigate('/dashboard');
    } catch {
      setMessage("Natijalarni saqlashda xato.");
    } finally {
      setSavingLog(false);
    }
  };

  if (loading) {
    return <div className="text-slate-300">Taymer yuklanmoqda...</div>;
  }

  if (!plan) {
    return (
      <div className="glass rounded-2xl p-6 text-slate-200">
        <p className="mb-4">{message || "Vazifa topilmadi."}</p>
        <Link to="/dashboard" className="text-emerald-400 hover:text-emerald-300">Panelga qaytish</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 px-4 py-6 md:px-10 md:py-10">
      <div className="w-full max-w-none rounded-2xl p-6 md:p-10 border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          type="button"
          onClick={async () => {
            await saveSession({ stopAfterSave: true, silent: true });
            navigate('/dashboard');
          }}
          className="px-4 py-2 rounded-lg bg-white/10 text-slate-200 hover:bg-white/20"
        >
          Orqaga
        </button>
        <h1 className="text-lg md:text-2xl font-bold text-white text-center flex-1">{plan.title}</h1>
        <div className="w-[72px]" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-8 flex flex-col items-center justify-center bg-black/30 border border-white/10">
          <p className="text-slate-400 mb-2">Joriy Diqqat Sessiyasi</p>

          <div className="grid grid-cols-3 gap-3 md:gap-5 w-full max-w-5xl mb-8">
            {timeParts.map((part, index) => (
              <div key={`${part}-${index}`} className="rounded-3xl bg-slate-950 border border-white/10 min-h-[150px] md:min-h-[230px] flex items-center justify-center">
                <span className="text-7xl md:text-[11rem] leading-none font-black text-slate-200 tabular-nums">
                  {part}
                </span>
              </div>
            ))}
          </div>

          <p className="text-slate-400 mt-6 text-sm">
            Sessiya: {formatTime(sessionSeconds)} | Jami sarflangan vaqt: {Math.round(totalSeconds / 60)} daq
          </p>
          <p className={`mt-1 text-xs ${running ? "text-emerald-400" : "text-amber-300"}`}>
            {running ? "Taymer ishlayapti" : "Taymer to'xtatilgan"}
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Har 20 daqiqada qisqa tanaffus eslatmasi chiqadi.
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Energiya Tekshiruvi</h2>
          <form className="space-y-5" onSubmit={saveRatingAndStopTimer}>
            <div>
              <p className="block text-slate-300 text-sm mb-2">Energiya: {energy}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={`energy-${v}`}
                    type="button"
                    onClick={() => setEnergy(v)}
                    className={`w-10 h-10 rounded-lg border text-sm font-bold ${energy === v ? "bg-red-500 border-red-400 text-white" : "bg-white/5 border-white/10 text-slate-300"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="block text-slate-300 text-sm mb-2">Diqqat: {focus}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={`focus-${v}`}
                    type="button"
                    onClick={() => setFocus(v)}
                    className={`w-10 h-10 rounded-lg border text-sm font-bold ${focus === v ? "bg-emerald-500 border-emerald-400 text-white" : "bg-white/5 border-white/10 text-slate-300"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="block text-slate-300 text-sm mb-2">Zo'riqish: {stress}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={`stress-${v}`}
                    type="button"
                    onClick={() => setStress(v)}
                    className={`w-10 h-10 rounded-lg border text-sm font-bold ${stress === v ? "bg-indigo-500 border-indigo-400 text-white" : "bg-white/5 border-white/10 text-slate-300"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={savingLog || saving}
              className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold"
            >
              {savingLog || saving ? 'Saqlanmoqda...' : "Reytingni saqlash"}
            </button>
          </form>
          {message && <p className="text-emerald-300 text-sm mt-4">{message}</p>}
        </div>
      </div>
      </div>

      {breakModalOpen && (
        <div
          className="fixed inset-0 z-[70] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {}}
        >
          <div className="w-full max-w-xl rounded-2xl border border-white/20 bg-slate-900 p-6">
            <h3 className="text-2xl font-bold text-white">Qisqa tanaffus qiling</h3>
            <p className="text-slate-300 mt-2">
              20 daqiqa diqqat ishladingiz. 1-2 daqiqa jismoniy mashq qiling va davom eting.
            </p>

            <div className="mt-4 space-y-2 text-slate-200">
              <p>1. Bo'yin va yelkani aylantiring (30 soniya)</p>
              <p>2. O'rningizdan turib cho'ziling (30 soniya)</p>
              <p>3. 10 marotaba chuqur nafas oling</p>
            </div>

            <label className="mt-5 flex items-center gap-3 text-slate-200">
              <input
                type="checkbox"
                checked={breakConfirmed}
                onChange={(e) => setBreakConfirmed(e.target.checked)}
                className="w-5 h-5 rounded accent-emerald-500"
              />
              Mashqlarni bajardim, davom etaman
            </label>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                disabled={!breakConfirmed}
                onClick={() => {
                  setBreakModalOpen(false);
                  setRunning(true);
                }}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold"
              >
                Davom etish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
