import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { Priority } from '../types';
import './AdminPages.css';

export default function SLAConfig() {
  const { slaConfigs, categories, updateSLAConfig, addSLAConfig } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFirstResp, setEditFirstResp] = useState(60);
  const [editResolution, setEditResolution] = useState(480);
  const [showAdd, setShowAdd] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('Medium');
  const [newFirstResp, setNewFirstResp] = useState(60);
  const [newResolution, setNewResolution] = useState(480);

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;

  const startEdit = (s: { id: string; firstResponseMinutes: number; resolutionMinutes: number }) => {
    setEditingId(s.id);
    setEditFirstResp(s.firstResponseMinutes);
    setEditResolution(s.resolutionMinutes);
  };

  const handleSave = (id: string) => {
    updateSLAConfig(id, { firstResponseMinutes: editFirstResp, resolutionMinutes: editResolution });
    setEditingId(null);
  };

  const handleAdd = () => {
    const cat = categories.find((c) => c.id === newCategory || c.name === newCategory);
    if (cat) {
      addSLAConfig({
        categoryId: cat.id,
        priority: newPriority,
        firstResponseMinutes: newFirstResp,
        resolutionMinutes: newResolution,
        version: 1,
      });
      setShowAdd(false);
      setNewCategory('');
      setNewPriority('Medium');
      setNewFirstResp(60);
      setNewResolution(480);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>SLA & Policies</h1>
          <p className="page-subtitle">Configure SLA rules per category and priority</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">Add SLA Rule</button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Priority</th>
              <th>First Response (min)</th>
              <th>Resolution (min)</th>
              <th>Version</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slaConfigs.map((s) => (
              <tr key={s.id}>
                <td>{getCategoryName(s.categoryId)}</td>
                <td>{s.priority}</td>
                <td>
                  {editingId === s.id ? (
                    <input
                      type="number"
                      value={editFirstResp}
                      onChange={(e) => setEditFirstResp(Number(e.target.value))}
                    />
                  ) : (
                    s.firstResponseMinutes
                  )}
                </td>
                <td>
                  {editingId === s.id ? (
                    <input
                      type="number"
                      value={editResolution}
                      onChange={(e) => setEditResolution(Number(e.target.value))}
                    />
                  ) : (
                    s.resolutionMinutes
                  )}
                </td>
                <td>v{s.version}</td>
                <td>
                  {editingId === s.id ? (
                    <button onClick={() => handleSave(s.id)} className="btn-sm">Save</button>
                  ) : (
                    <button onClick={() => startEdit(s)} className="btn-sm">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add SLA Rule</h3>
            <div className="form-group">
              <label>Category</label>
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                <option value="">Select</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as Priority)}>
                {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>First Response (minutes)</label>
              <input type="number" value={newFirstResp} onChange={(e) => setNewFirstResp(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Resolution (minutes)</label>
              <input type="number" value={newResolution} onChange={(e) => setNewResolution(Number(e.target.value))} />
            </div>
            <div className="modal-actions">
              <button onClick={handleAdd} className="btn-primary" disabled={!newCategory}>Add</button>
              <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
