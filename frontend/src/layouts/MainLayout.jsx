import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navigation/Navbar';

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-900">
            {/* Orqa fon bezagi */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-emerald-900/30 to-blue-900/20 blur-3xl -z-10" />

            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
}
