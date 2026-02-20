import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import type { FeedbackStatus } from '../types';
import './FeedbackQueue.css';

const FEEDBACK_TYPES: Record<string, string> = {
  wrong_category: 'Wrong category',
  wrong_priority: 'Wrong priority',
  incorrect_response: 'Incorrect suggested response',
  missing_context: 'Missing context',
  policy_risk: 'Policy risk',
};

export default function FeedbackQueue() {
  const { feedback } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = feedback.filter((f) =>
    statusFilter === 'all' || f.status === statusFilter
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Feedback Queue</h1>
        <p className="page-subtitle">Human-in-loop feedback submitted by agents</p>
      </div>
      <div className="filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {(['Submitted', 'Reviewed', 'Action Taken'] as FeedbackStatus[]).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="feedback-list">
        {filtered.map((f) => (
          <div key={f.id} className="feedback-card">
            <div className="feedback-header">
              <Link to={`/agent/tickets/${f.ticketId}`} className="feedback-ticket">{f.ticketId}</Link>
              <span className={`feedback-status status-${f.status.toLowerCase().replace(' ', '-')}`}>{f.status}</span>
            </div>
            <div className="feedback-body">
              <div className="feedback-row">
                <span className="label">Type:</span>
                <span>{FEEDBACK_TYPES[f.type] ?? f.type}</span>
              </div>
              <div className="feedback-row">
                <span className="label">Severity:</span>
                <span>{f.severity}</span>
              </div>
              <div className="feedback-row">
                <span className="label">Explanation:</span>
                <span>{f.explanation}</span>
              </div>
              {f.adminComments && (
                <div className="feedback-row admin-comments">
                  <span className="label">Admin comments:</span>
                  <span>{f.adminComments}</span>
                </div>
              )}
            </div>
            <div className="feedback-footer">
              <span>{f.submittedBy}</span>
              <span>{format(new Date(f.submittedAt), 'MMM d, yyyy HH:mm')}</span>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="empty-state">No feedback items.</p>
      )}
    </div>
  );
}
