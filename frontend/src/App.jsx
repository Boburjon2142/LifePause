import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FocusTimer from './pages/FocusTimer';
import Calendar from './pages/Calendar';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="calendar" element={<Calendar />} />
      </Route>
      <Route path="/focus/:planId" element={<FocusTimer />} />
    </Routes>
  );
}

export default App;
