import { useState } from 'react';
import { useStore } from '../store/useStore';
import { mockUsers } from '../data/mockData';
import './AdminPages.css';

export default function TeamsManagement() {
  const { teams, categories, updateTeam, addTeam } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');

  const agents = mockUsers.filter((u) => u.role === 'agent');

  const handleAdd = () => {
    if (!newName.trim()) return;
    addTeam({ name: newName, categoryIds: [], memberIds: [] });
    setShowAdd(false);
    setNewName('');
  };

  const toggleMember = (teamId: string, userId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;
    const memberIds = team.memberIds.includes(userId)
      ? team.memberIds.filter((id) => id !== userId)
      : [...team.memberIds, userId];
    updateTeam(teamId, { memberIds });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Teams & Roles</h1>
        <p className="page-subtitle">Create and manage teams, assign members and categories</p>
        <button onClick={() => setShowAdd(true)} className="btn-primary">Create Team</button>
      </div>
      <div className="teams-grid">
        {teams.map((t) => (
          <div key={t.id} className="admin-card">
            <div className="card-header">
              <h3>{t.name}</h3>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="label">Categories:</span>
                <span>{categories.filter((c) => t.categoryIds.includes(c.id)).map((c) => c.name).join(', ') || '—'}</span>
              </div>
              <div className="info-row">
                <span className="label">Members:</span>
                <div className="member-list">
                  {agents.map((a) => (
                    <label key={a.id} className="member-item">
                      <input
                        type="checkbox"
                        checked={t.memberIds.includes(a.id)}
                        onChange={() => toggleMember(t.id, a.id)}
                      />
                      {a.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create Team</h3>
            <div className="form-group">
              <label>Team Name</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Billing Support" />
            </div>
            <div className="modal-actions">
              <button onClick={handleAdd} className="btn-primary" disabled={!newName.trim()}>Create</button>
              <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
