import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {AppStateProvider} from './context/AppStateContext';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import RelapseFlow from './pages/RelapseFlow';
import SOSSetup from './pages/SOSSetup';
import UrgeFlow from './pages/UrgeFlow';

function App() {
  return (
    <AppStateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/relapse" element={<RelapseFlow />} />
          <Route path="/sos-setup" element={<SOSSetup />} />
          <Route path="/urge" element={<UrgeFlow />} />
        </Routes>
      </Router>
    </AppStateProvider>
  );
}

export default App;
