import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FocusTimer from './pages/FocusTimer';
import Calendar from './pages/Calendar';
import Features from './pages/Features';
import AI from './pages/AI';
import Pricing from './pages/Pricing';
import RecurringPlans from './pages/RecurringPlans';
import Results from './pages/Results';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="recurring-plans" element={<RecurringPlans />} />
        <Route path="results" element={<Results />} />
        <Route path="features" element={<Features />} />
        <Route path="ai" element={<AI />} />
        <Route path="pricing" element={<Pricing />} />
      </Route>
      <Route path="/focus/:planId" element={<FocusTimer />} />
    </Routes>
  );
}

export default App;
