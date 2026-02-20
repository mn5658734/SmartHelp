import { useState } from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import './AdminPages.css';

export default function AuditLogs() {
  const { auditLogs } = useStore();
  const [ticketFilter, setTicketFilter] = useState('');

  const filtered = ticketFilter
    ? auditLogs.filter((a) => a.ticketId.toLowerCase().includes(ticketFilter.toLowerCase()))
    : auditLogs;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Audit Logs</h1>
        <p className="page-subtitle">System audit trail for all state changes</p>
      </div>
      <div className="filters">
        <input
          type="search"
          placeholder="Filter by Ticket ID..."
          value={ticketFilter}
          onChange={(e) => setTicketFilter(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Ticket ID</th>
              <th>Action</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {[...filtered].reverse().map((a) => (
              <tr key={a.id}>
                <td>{format(new Date(a.timestamp), 'MMM d, yyyy HH:mm:ss')}</td>
                <td>{a.ticketId}</td>
                <td>{a.action}</td>
                <td>{a.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
