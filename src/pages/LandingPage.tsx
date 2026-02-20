import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { mockUsers } from '../data/mockData';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const setCurrentUser = useStore((s) => s.setCurrentUser);

  const handleAdmin = () => {
    setCurrentUser(mockUsers[2]); // Carol Admin
    navigate('/admin');
  };

  const handleAgent = () => {
    setCurrentUser(mockUsers[0]); // Alice Chen (agent)
    navigate('/agent');
  };

  return (
    <div className="landing">
      <div className="landing-content">
        <h1 className="landing-title">SmartHelp</h1>
        <p className="landing-subtitle">Ticketing & Human-in-Loop Support System</p>
        <div className="landing-options">
          <button type="button" className="landing-card" onClick={handleAdmin}>
            <span className="landing-card-icon">⚙️</span>
            <span className="landing-card-label">Admin</span>
            <span className="landing-card-desc">Configure SLAs, teams, workflows, reports & analytics</span>
          </button>
          <button type="button" className="landing-card" onClick={handleAgent}>
            <span className="landing-card-icon">🎫</span>
            <span className="landing-card-label">Agent</span>
            <span className="landing-card-desc">Handle tickets, escalations & feedback</span>
          </button>
        </div>
      </div>
    </div>
  );
}
