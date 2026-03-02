import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ActivityTree from '../components/Dashboard/ActivityTree';
import DailyPlanner from '../components/Dashboard/DailyPlanner';
import EnergySummary from '../components/Dashboard/EnergySummary';
import ProgressChart from '../components/Dashboard/ProgressChart';
import ResultsPanel from '../components/Dashboard/ResultsPanel';

export default function Dashboard() {
    const location = useLocation();
    const [evaluation, setEvaluation] = useState(null);
    const [aiRecommendation, setAiRecommendation] = useState(null);
    const [progressData, setProgressData] = useState([]);
    const [resultsData, setResultsData] = useState([]);
    const latestThreeResults = resultsData.slice(0, 3);

    useEffect(() => {
        // Fetch evaluation
        api.get('analytics/evaluate/').then(res => setEvaluation(res.data)).catch(console.error);
        // Fetch AI
        api.get('ai/recommendations/').then(res => setAiRecommendation(res.data)).catch(console.error);
        api.get('analytics/progress/?days=7').then(res => setProgressData(res.data)).catch(console.error);
        api.get('analytics/results/?days=14').then(res => setResultsData(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        if (!location.hash) return;
        const targetId = location.hash.replace('#', '');
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [location.hash]);

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
                    <ProgressChart progressData={progressData} />
                </div>

                {/* O'ng ustun: Rejalashtirish */}
                <div className="lg:col-span-2 space-y-8">
                    <div id="planner" className="glass rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-6">Bugungi Reja</h2>
                        <DailyPlanner />
                    </div>
                    <div id="results">
                        <ResultsPanel results={latestThreeResults} />
                    </div>
                </div>
            </div>
        </div>
    );
}
