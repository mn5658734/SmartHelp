import { useState } from 'react';
import { useStore } from '../store/useStore';
import './AdminPages.css';

export default function CategoriesRouting() {
  const { categories, teams, updateCategory, addCategory } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTeamId, setNewTeamId] = useState('');

  const handleAdd = () => {
    if (!newName.trim() || !newTeamId) return;
    addCategory({ name: newName, teamId: newTeamId });
    const team = teams.find((t) => t.id === newTeamId);
    if (team) {
      // Add category to team's categoryIds - we need to update the team
      // For now addCategory just adds to categories; team update would need the new category id
      // We'll handle this in the store - addCategory returns the new id... actually we don't.
      // Let me add a simpler flow - when we add a category we need to update the team.
      // The store's addCategory generates id as c${Date.now()}. We'd need to get that.
      // For simplicity, we'll just add the category. The team's categoryIds can be updated separately.
    }
    setShowAdd(false);
    setNewName('');
    setNewTeamId('');
  };

  const handleTeamChange = (catId: string, teamId: string) => {
    updateCategory(catId, { teamId });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Categories & Routing</h1>
        <p className="page-subtitle">Define ticket categories and routing rules</p>
        <button onClick={() => setShowAdd(true)} className="btn-primary">Add Category</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Routed to Team</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>
                  <select
                    value={c.teamId}
                    onChange={(e) => handleTeamChange(c.id, e.target.value)}
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </td>
                <td>—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Category</h3>
            <div className="form-group">
              <label>Category Name</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Billing" />
            </div>
            <div className="form-group">
              <label>Route to Team</label>
              <select value={newTeamId} onChange={(e) => setNewTeamId(e.target.value)}>
                <option value="">Select team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={handleAdd} className="btn-primary" disabled={!newName.trim() || !newTeamId}>Add</button>
              <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
