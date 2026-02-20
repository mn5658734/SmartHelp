import { useStore } from '../store/useStore';
import './Settings.css';

export default function AdminSettings() {
  const { currentUser } = useStore();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Admin Settings</h1>
        <p className="page-subtitle">Administrator preferences</p>
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
      </div>
      <div className="settings-card">
        <h3>Alerts</h3>
        <div className="settings-row">
          <span className="label">SLA breach alerts</span>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="settings-row">
          <span className="label">Volume spike alerts</span>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="settings-row">
          <span className="label">AI misclassification signals</span>
          <input type="checkbox" defaultChecked />
        </div>
      </div>
    </div>
  );
}
