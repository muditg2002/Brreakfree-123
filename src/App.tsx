import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppState } from './hooks/useAppState';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import UrgeFlow from './pages/UrgeFlow';
import RelapseFlow from './pages/RelapseFlow';
import Stats from './pages/Stats';
import SOSSetup from './pages/SOSSetup';

export default function App() {
  const { user } = useAppState();

  return (
    <Router>
      <div className="mobile-container">
        <Routes>
          <Route 
            path="/onboarding" 
            element={user?.onboardingCompleted ? <Navigate to="/" /> : <Onboarding />} 
          />
          <Route 
            path="/" 
            element={user?.onboardingCompleted ? <Home /> : <Navigate to="/onboarding" />} 
          />
          <Route path="/urge" element={<UrgeFlow />} />
          <Route path="/relapse" element={<RelapseFlow />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/sos-setup" element={<SOSSetup />} />
        </Routes>
      </div>
    </Router>
  );
}
