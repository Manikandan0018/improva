import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Reservation from './pages/Reservation';
import Dashboard from './pages/Dashboard';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bus-dark">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reserve" element={<Reservation />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
