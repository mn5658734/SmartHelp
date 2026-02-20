import { useStore } from '../store/useStore';
import './Settings.css';

export default function AgentSettings() {
  const { currentUser } = useStore();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="page-subtitle">Profile and notification preferences</p>
      </div>
      <div className="settings-card">
        <h3>Profile</h3>
        <div className="settings-row">
          <span className="label">Name</span>
          <span>{currentUser?.name}</span>
        </div>
        <div className="settings-row">
          <span className="label">Email</span>
          <span>{currentUser?.email}</span>
        </div>
        <div className="settings-row">
          <span className="label">Role</span>
          <span>{currentUser?.role}</span>
        </div>
        <div className="settings-row">
          <span className="label">Escalation Level</span>
          <span>{currentUser?.escalationLevel ?? '—'}</span>
        </div>
      </div>
      <div className="settings-card">
        <h3>Notifications</h3>
        <div className="settings-row">
          <span className="label">New assignments</span>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="settings-row">
          <span className="label">SLA due soon</span>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="settings-row">
          <span className="label">Escalations assigned</span>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="settings-row">
          <span className="label">SME replies received</span>
          <input type="checkbox" defaultChecked />
        </div>
      </div>
    </div>
  );
}
