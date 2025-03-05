import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Weather from './components/Weather';
import TripHistory from './components/TripHistory';
import './App.css';

function AppContent() {
  const location = useLocation();

  // Add background image only for the /history route
  const isHistoryRoute = location.pathname === '/history';

  return (
    <div className={`app-container ${isHistoryRoute ? 'history-background' : ''}`}>
      <Routes>
        <Route path="/" element={<Weather />} />
        <Route path="/history" element={<TripHistory />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
