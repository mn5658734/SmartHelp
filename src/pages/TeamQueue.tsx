import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import type { Ticket, TicketStatus, Priority } from '../types';
import './TicketList.css';

export default function TeamQueue() {
  const { tickets, currentUser } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const teamTickets = tickets.filter((t) => t.teamId === currentUser?.teamId);

  const filtered = teamTickets.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSlaClass = (t: Ticket) => {
    const due = new Date(t.slaDueAt).getTime();
    const now = Date.now();
    if (due < now) return 'sla-breach';
    if (due - now < 2 * 60 * 60 * 1000) return 'sla-due';
    return '';
  };

  const getConfidenceClass = (c: number) =>
    c < 0.7 ? 'conf-low' : c < 0.85 ? 'conf-med' : 'conf-high';

  return (
    <div className="page">
      <div className="page-header">
        <h1>Team Queue</h1>
        <p className="page-subtitle">Tickets in your team's queue</p>
      </div>
      <div className="filters">
        <input
          type="search"
          placeholder="Search by ID, customer, keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {(['New', 'In Progress', 'Waiting for SME', 'Resolved', 'Closed'] as TicketStatus[]).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="all">All priorities</option>
          {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <div className="table-wrap">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>SLA</th>
              <th>Confidence</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td><Link to={`/agent/tickets/${t.id}`} className="ticket-link">{t.id}</Link></td>
                <td>{t.customerName}</td>
                <td>{t.category}</td>
                <td><span className={`priority-badge priority-${t.priority.toLowerCase()}`}>{t.priority}</span></td>
                <td>{t.status}</td>
                <td>{t.assignedToName || '—'}</td>
                <td className={getSlaClass(t)}>
                  {format(new Date(t.slaDueAt), 'MMM d, HH:mm')}
                </td>
                <td><span className={`confidence ${getConfidenceClass(t.aiConfidence)}`}>
                  {Math.round(t.aiConfidence * 100)}%
                </span></td>
                <td>{format(new Date(t.updatedAt), 'MMM d, HH:mm')}</td>
                <td>
                  <Link to={`/agent/tickets/${t.id}`} className="btn-sm">Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <p className="empty-state">No tickets in team queue.</p>
      )}
    </div>
  );
}
