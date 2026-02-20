import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import './AgentDashboard.css';

export default function AgentDashboard() {
  const { tickets, currentUser } = useStore();
  const myTickets = tickets.filter((t) => t.assignedTo === currentUser?.id);
  const slaDueSoon = tickets.filter((t) => {
    const due = new Date(t.slaDueAt).getTime();
    const in2hr = Date.now() + 2 * 60 * 60 * 1000;
    return due <= in2hr && due > Date.now() && t.status !== 'Closed' && t.status !== 'Resolved';
  });
  const breached = tickets.filter((t) => new Date(t.slaDueAt) < new Date() && t.status !== 'Closed' && t.status !== 'Resolved');
  const lowConfidence = tickets.filter((t) => t.aiConfidence < 0.7);

  return (
    <div className="agent-dashboard">
      <h1>Agent Dashboard</h1>
      <p className="dashboard-subtitle">Quick view of your workload and SLA risk</p>
      <div className="dashboard-widgets">
        <div className="widget">
          <span className="widget-value">{myTickets.length}</span>
          <span className="widget-label">Tickets assigned to me</span>
          <Link to="/agent/tickets" className="widget-action">Go to My Tickets</Link>
        </div>
        <div className="widget warning">
          <span className="widget-value">{slaDueSoon.length}</span>
          <span className="widget-label">SLA due soon (next 2 hrs)</span>
          <Link to="/agent/tickets?filter=sla-due" className="widget-action">View SLA due soon</Link>
        </div>
        <div className="widget danger">
          <span className="widget-value">{breached.length}</span>
          <span className="widget-label">Breached tickets</span>
        </div>
        <div className="widget">
          <span className="widget-value">{lowConfidence.length}</span>
          <span className="widget-label">AI confidence alerts (low)</span>
        </div>
      </div>
    </div>
  );
}
