import { useStore } from '../store/useStore';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { tickets } = useStore();
  const today = tickets.filter((t) => {
    const d = new Date(t.createdAt);
    const n = new Date();
    return d.toDateString() === n.toDateString();
  });
  const breached = tickets.filter((t) => new Date(t.slaDueAt) < new Date() && t.status !== 'Closed' && t.status !== 'Resolved');

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p className="dashboard-subtitle">Overview of system metrics and performance</p>
      <div className="dashboard-widgets">
        <div className="widget">
          <span className="widget-value">{today.length}</span>
          <span className="widget-label">Tickets today</span>
        </div>
        <div className="widget">
          <span className="widget-value">{breached.length}</span>
          <span className="widget-label">SLA breaches</span>
        </div>
        <div className="widget">
          <span className="widget-value">—</span>
          <span className="widget-label">SLA adherence %</span>
        </div>
        <div className="widget">
          <span className="widget-value">—</span>
          <span className="widget-label">Escalation rate</span>
        </div>
      </div>
    </div>
  );
}
