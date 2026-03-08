import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ActivityTree from '../components/Dashboard/ActivityTree';
import DailyPlanner from '../components/Dashboard/DailyPlanner';
import EnergySummary from '../components/Dashboard/EnergySummary';
import ProgressChart from '../components/Dashboard/ProgressChart';
import ResultsPanel from '../components/Dashboard/ResultsPanel';
import MorningCheckInWidget from '../components/Dashboard/MorningCheckInWidget';
import ReflectionCard from '../components/Dashboard/ReflectionCard';
import FutureGoalsPreview from '../components/Dashboard/FutureGoalsPreview';
import LifeAreaGrid from '../components/Dashboard/LifeAreaGrid';

export default function Dashboard() {
    const location = useLocation();
    const [evaluation, setEvaluation] = useState(null);
    const [aiRecommendation, setAiRecommendation] = useState(null);
    const [progressData, setProgressData] = useState([]);
    const [resultsData, setResultsData] = useState([]);
    const [growthSnapshot, setGrowthSnapshot] = useState(null);
    const [savingMorning, setSavingMorning] = useState(false);
    const [savingReflection, setSavingReflection] = useState(false);
    const latestThreeResults = resultsData.slice(0, 3);

    useEffect(() => {
        // Fetch evaluation
        api.get('analytics/evaluate/').then(res => setEvaluation(res.data)).catch(console.error);
        // Fetch AI
        api.get('ai/recommendations/').then(res => setAiRecommendation(res.data)).catch(console.error);
        api.get('analytics/progress/?days=7').then(res => setProgressData(res.data)).catch(console.error);
        api.get('analytics/results/?days=14').then(res => setResultsData(res.data)).catch(console.error);
        api.get('analytics/growth-snapshot/').then(res => setGrowthSnapshot(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        if (!location.hash) return;
        const targetId = location.hash.replace('#', '');
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [location.hash]);

    const handleMorningSave = async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const payload = {
            main_focus: form.get('main_focus'),
            priority_habit: form.get('priority_habit'),
            energy_level: Number(form.get('energy_level') || 3),
        };
        setSavingMorning(true);
        try {
            const existing = growthSnapshot?.morning_checkin?.exists;
            const sameDay = await api.get('analytics/morning-checkins/?date=' + new Date().toISOString().slice(0, 10));
            const target = sameDay.data?.[0];
            const res = target
                ? await api.patch(`analytics/morning-checkins/${target.id}/`, payload)
                : await api.post('analytics/morning-checkins/', payload);
            setGrowthSnapshot((prev) => ({
                ...prev,
                morning_checkin: { exists: true, ...res.data },
            }));
        } catch (error) {
            console.error("Tonggi check-in saqlanmadi", error);
        } finally {
            setSavingMorning(false);
        }
    };

    const handleReflectionSave = async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const payload = {
            prompt: form.get('prompt'),
            mood: form.get('mood'),
            response: form.get('response'),
        };
        setSavingReflection(true);
        try {
            const today = new Date().toISOString().slice(0, 10);
            const sameDay = await api.get('analytics/reflections/');
            const target = sameDay.data?.find((item) => item.date === today);
            const res = target
                ? await api.patch(`analytics/reflections/${target.id}/`, payload)
                : await api.post('analytics/reflections/', payload);
            setGrowthSnapshot((prev) => ({
                ...prev,
                latest_reflection: { exists: true, ...res.data },
            }));
        } catch (error) {
            console.error("Refleksiya saqlanmadi", error);
        } finally {
            setSavingReflection(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">Boshqaruv Paneli</h1>
                <p className="text-slate-400">Qaytganingiz bilan. Bu yerda kunlik holatingiz ko'rinadi.</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Chap ustun: Daraxt va energiya */}
                <div className="space-y-8 lg:col-span-1">
                    <ActivityTree evaluation={evaluation} />
                    <EnergySummary evaluation={evaluation} aiRecommendation={aiRecommendation} />
                    <MorningCheckInWidget
                        key={`morning-${growthSnapshot?.morning_checkin?.main_focus || 'empty'}-${growthSnapshot?.morning_checkin?.energy_level || 3}`}
                        snapshot={growthSnapshot}
                        onSave={handleMorningSave}
                        saving={savingMorning}
                    />
                    <ProgressChart progressData={progressData} />
                </div>

                {/* O'ng ustun: Rejalashtirish */}
                <div className="lg:col-span-2 space-y-8">
                    <LifeAreaGrid items={evaluation?.life_areas || []} />
                    <div id="planner" className="glass rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-6">Bugungi Reja</h2>
                        <DailyPlanner />
                    </div>
                    <ReflectionCard
                        key={`reflection-${growthSnapshot?.latest_reflection?.date || 'empty'}-${growthSnapshot?.latest_reflection?.mood || 'none'}`}
                        snapshot={growthSnapshot}
                        onSave={handleReflectionSave}
                        saving={savingReflection}
                    />
                    <FutureGoalsPreview goals={growthSnapshot?.future_goals || []} />
                    <div id="results">
                        <ResultsPanel results={latestThreeResults} />
                    </div>
                </div>
            </div>
        </div>
    );
}
