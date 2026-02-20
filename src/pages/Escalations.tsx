import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import './TicketList.css';

export default function Escalations() {
  const { tickets } = useStore();
  const escalated = tickets.filter((t) =>
    (t.escalationLevel === 'L2' || t.escalationLevel === 'L3') &&
    t.status !== 'Closed' && t.status !== 'Resolved'
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Escalations</h1>
        <p className="page-subtitle">Tickets escalated to L2/L3 pending resolution</p>
      </div>
      <div className="table-wrap">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Escalation</th>
              <th>Assigned To</th>
              <th>SLA</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {escalated.map((t) => (
              <tr key={t.id}>
                <td><Link to={`/agent/tickets/${t.id}`} className="ticket-link">{t.id}</Link></td>
                <td>{t.customerName}</td>
                <td>{t.category}</td>
                <td><span className={`priority-badge priority-${t.priority.toLowerCase()}`}>{t.priority}</span></td>
                <td>{t.escalationLevel}</td>
                <td>{t.assignedToName || '—'}</td>
                <td>{format(new Date(t.slaDueAt), 'MMM d, HH:mm')}</td>
                <td>{format(new Date(t.updatedAt), 'MMM d, HH:mm')}</td>
                <td><Link to={`/agent/tickets/${t.id}`} className="btn-sm">Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {escalated.length === 0 && (
        <p className="empty-state">No escalations pending.</p>
      )}
    </div>
  );
}
