import { useState } from 'react';
import { useStore } from '../store/useStore';

function ReportFilters({ dateFrom, dateTo, setDateFrom, setDateTo, teamFilter, setTeamFilter, categoryFilter, setCategoryFilter }: {
  dateFrom: string; dateTo: string; setDateFrom: (v: string) => void; setDateTo: (v: string) => void;
  teamFilter: string; setTeamFilter: (v: string) => void; categoryFilter: string; setCategoryFilter: (v: string) => void;
}) {
  const { teams, categories } = useStore();
  return (
    <div className="filters report-filters">
      <div className="form-group">
        <label>Date From</label>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Date To</label>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Team</label>
        <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}>
          <option value="">All</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Category</label>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
import { format } from 'date-fns';
import './AdminPages.css';

export default function Reports() {
  const { tickets } = useStore();
  const [dateFrom, setDateFrom] = useState(format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [teamFilter, setTeamFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filtered = tickets.filter((t) => {
    const created = new Date(t.createdAt).getTime();
    const from = new Date(dateFrom).getTime();
    const to = new Date(dateTo).getTime() + 86400000;
    if (created < from || created > to) return false;
    if (teamFilter && t.teamId !== teamFilter) return false;
    if (categoryFilter && t.categoryId !== categoryFilter) return false;
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Customer', 'Category', 'Priority', 'Status', 'Created', 'Updated'];
    const rows = filtered.map((t) =>
      [t.id, t.customerName, t.category, t.priority, t.status, t.createdAt, t.updatedAt].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smarthelp-report-${dateFrom}-${dateTo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Reports</h1>
        <p className="page-subtitle">Download reports with filters (CSV, PDF)</p>
      </div>
      <ReportFilters
        dateFrom={dateFrom} dateTo={dateTo} setDateFrom={setDateFrom} setDateTo={setDateTo}
        teamFilter={teamFilter} setTeamFilter={setTeamFilter}
        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
      />
      <div className="report-actions">
        <button onClick={handleExportCSV} className="btn-primary">Export CSV</button>
        <span className="report-count">{filtered.length} tickets</span>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 20).map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.customerName}</td>
                <td>{t.category}</td>
                <td>{t.priority}</td>
                <td>{t.status}</td>
                <td>{format(new Date(t.createdAt), 'MMM d, yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length > 20 && (
        <p className="report-note">Showing first 20 of {filtered.length}. Export CSV for full data.</p>
      )}
    </div>
  );
}
