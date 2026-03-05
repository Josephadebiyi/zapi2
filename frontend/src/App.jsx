import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import WhySeeta from './pages/WhySeeta';
import HowToUse from './pages/HowToUse';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/why-seeta" element={<WhySeeta />} />
        <Route path="/how-to-use" element={<HowToUse />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/admin-central" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
