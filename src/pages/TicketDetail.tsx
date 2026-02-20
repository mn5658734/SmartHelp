import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import type { TicketStatus, Priority, EscalationLevel } from '../types';
import Modal from '../components/Modal';
import './TicketDetail.css';

const STATUS_OPTIONS: TicketStatus[] = ['New', 'In Progress', 'Waiting for SME', 'Resolved', 'Closed'];
const PRIORITY_OPTIONS: Priority[] = ['Low', 'Medium', 'High', 'Critical'];
const ESCALATION_OPTIONS: EscalationLevel[] = ['L1', 'L2', 'L3'];

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, teams, currentUser, updateTicket, addTicketMessage, addFeedback, addAuditLog } = useStore();
  const ticket = tickets.find((t) => t.id === id);

  const [status, setStatus] = useState(ticket?.status ?? 'New');
  const [priority, setPriority] = useState(ticket?.priority ?? 'Medium');
  const [escalation, setEscalation] = useState(ticket?.escalationLevel ?? 'L1');

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setPriority(ticket.priority);
      setEscalation(ticket.escalationLevel);
      setResolutionSummary(ticket.resolutionSummary ?? '');
    }
  }, [ticket?.id, ticket?.status, ticket?.priority, ticket?.escalationLevel, ticket?.resolutionSummary]);
  const [internalComment, setInternalComment] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState(ticket?.resolutionSummary ?? '');
  const [showClarification, setShowClarification] = useState(false);
  const [showReassign, setShowReassign] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [clarificationMsg, setClarificationMsg] = useState('');
  const [reassignTeam, setReassignTeam] = useState('');
  const [reassignReason, setReassignReason] = useState('');
  const [feedbackType, setFeedbackType] = useState<string>('wrong_category');
  const [feedbackSeverity, setFeedbackSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [feedbackExplanation, setFeedbackExplanation] = useState('');

  if (!ticket) {
    return (
      <div className="page">
        <p>Ticket not found.</p>
        <button onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  const handleStatusChange = (v: TicketStatus) => {
    setStatus(v);
    updateTicket(ticket.id, { status: v });
    addAuditLog({ ticketId: ticket.id, action: `Status changed to ${v}`, userId: currentUser?.id ?? '' });
  };

  const handlePriorityChange = (v: Priority) => {
    setPriority(v);
    updateTicket(ticket.id, { priority: v });
  };

  const handleEscalationChange = (v: EscalationLevel) => {
    setEscalation(v);
    updateTicket(ticket.id, { escalationLevel: v });
    addAuditLog({ ticketId: ticket.id, action: `Escalated to ${v}`, userId: currentUser?.id ?? '' });
  };

  const handleAddComment = () => {
    if (!internalComment.trim()) return;
    addTicketMessage(ticket.id, {
      type: 'internal',
      content: internalComment,
      author: currentUser?.name,
    });
    setInternalComment('');
  };

  const handleRequestClarification = () => {
    addTicketMessage(ticket.id, {
      type: 'system',
      content: `Clarification requested from SME: ${clarificationMsg}`,
    });
    updateTicket(ticket.id, { status: 'Waiting for SME' });
    setShowClarification(false);
    setClarificationMsg('');
  };

  const handleReassign = () => {
    if (!reassignTeam || !reassignReason.trim()) return;
    const team = teams.find((t) => t.id === reassignTeam);
    updateTicket(ticket.id, { teamId: reassignTeam, assignedTo: undefined, assignedToName: undefined });
    addAuditLog({
      ticketId: ticket.id,
      action: `Reassigned to team ${team?.name ?? reassignTeam}. Reason: ${reassignReason}`,
      userId: currentUser?.id ?? '',
    });
    setShowReassign(false);
    setReassignTeam('');
    setReassignReason('');
  };

  const handleRaiseFeedback = () => {
    if (!feedbackExplanation.trim()) return;
    addFeedback({
      ticketId: ticket.id,
      type: feedbackType as any,
      severity: feedbackSeverity,
      explanation: feedbackExplanation,
      status: 'Submitted',
      submittedBy: currentUser?.name ?? '',
    });
    setShowFeedback(false);
    setFeedbackType('wrong_category');
    setFeedbackSeverity('medium');
    setFeedbackExplanation('');
  };

  const handleResolve = () => {
    if (!resolutionSummary.trim()) return;
    updateTicket(ticket.id, { status: 'Resolved', resolutionSummary });
    addAuditLog({ ticketId: ticket.id, action: 'Ticket resolved', userId: currentUser?.id ?? '' });
  };

  const handleClose = () => {
    updateTicket(ticket.id, { status: 'Closed' });
    addAuditLog({ ticketId: ticket.id, action: 'Ticket closed', userId: currentUser?.id ?? '' });
  };

  return (
    <div className="ticket-detail">
      <div className="ticket-detail-header">
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        <h1>{ticket.id} — {ticket.subject}</h1>
      </div>
      <div className="ticket-detail-layout">
        <div className="ticket-thread">
          <h3>Conversation</h3>
          {ticket.thread.map((m) => (
            <div key={m.id} className={`message message-${m.type}`}>
              <div className="message-meta">
                {m.author && <span className="message-author">{m.author}</span>}
                <span className="message-time">{format(new Date(m.createdAt), 'MMM d, HH:mm')}</span>
              </div>
              <div className="message-content">{m.content}</div>
            </div>
          ))}
        </div>
        <div className="ticket-actions">
          <h3>Actions</h3>
          <div className="action-group">
            <label>Status</label>
            <select value={status} onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="action-group">
            <label>Priority</label>
            <select value={priority} onChange={(e) => handlePriorityChange(e.target.value as Priority)}>
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="action-group">
            <label>Escalation</label>
            <select value={escalation} onChange={(e) => handleEscalationChange(e.target.value as EscalationLevel)}>
              {ESCALATION_OPTIONS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div className="action-buttons">
            <button onClick={() => setShowClarification(true)} className="btn-secondary">Request Clarification</button>
            <button onClick={() => setShowReassign(true)} className="btn-secondary">Assign to Team</button>
            <button onClick={() => setShowFeedback(true)} className="btn-secondary">Raise Feedback</button>
          </div>
          <div className="action-group">
            <label>Internal Comment</label>
            <textarea
              value={internalComment}
              onChange={(e) => setInternalComment(e.target.value)}
              placeholder="Add internal note..."
              rows={3}
            />
            <button onClick={handleAddComment} className="btn-sm" disabled={!internalComment.trim()}>Add</button>
          </div>
          {(status === 'Resolved' || status === 'Closed') ? (
            <div className="resolution-info">
              <strong>Resolution:</strong> {ticket.resolutionSummary}
            </div>
          ) : (
            <>
              <div className="action-group">
                <label>Resolution Summary</label>
                <textarea
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  placeholder="Summarize resolution..."
                  rows={2}
                />
              </div>
              <div className="action-buttons">
                <button onClick={handleResolve} className="btn-primary" disabled={!resolutionSummary.trim()}>
                  Mark Resolved
                </button>
                <button onClick={handleClose} className="btn-secondary">Close Ticket</button>
              </div>
            </>
          )}
        </div>
        <div className="ticket-ai-panel">
          <h3>AI Insights</h3>
          <div className="ai-card">
            <div className="ai-confidence">
              <span>Confidence</span>
              <strong>{Math.round(ticket.aiConfidence * 100)}%</strong>
            </div>
            <div className="ai-predicted">
              <span>Predicted Category</span>
              <strong>{ticket.aiPredictedCategory ?? '—'}</strong>
            </div>
            <div className="ai-sla">
              <span>SLA Due</span>
              <strong>{format(new Date(ticket.slaDueAt), 'MMM d, HH:mm')}</strong>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showClarification} onClose={() => setShowClarification(false)} title="Request Clarification">
        <div className="modal-form">
          <p><strong>To:</strong> {ticket.customerEmail}</p>
          <label>Message</label>
          <textarea value={clarificationMsg} onChange={(e) => setClarificationMsg(e.target.value)} rows={4} />
          <div className="modal-actions">
            <button onClick={handleRequestClarification} className="btn-primary">Send</button>
            <button onClick={() => setShowClarification(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showReassign} onClose={() => setShowReassign(false)} title="Assign to Team">
        <div className="modal-form">
          <label>Team</label>
          <select value={reassignTeam} onChange={(e) => setReassignTeam(e.target.value)}>
            <option value="">Select team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <label>Reason (required)</label>
          <input
            type="text"
            value={reassignReason}
            onChange={(e) => setReassignReason(e.target.value)}
            placeholder="Reason for reassignment"
          />
          <div className="modal-actions">
            <button onClick={handleReassign} className="btn-primary" disabled={!reassignTeam || !reassignReason.trim()}>Reassign</button>
            <button onClick={() => setShowReassign(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showFeedback} onClose={() => setShowFeedback(false)} title="Raise Feedback">
        <div className="modal-form">
          <label>Issue Type</label>
          <select value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)}>
            <option value="wrong_category">Wrong category</option>
            <option value="wrong_priority">Wrong priority</option>
            <option value="incorrect_response">Incorrect suggested response</option>
            <option value="missing_context">Missing context</option>
            <option value="policy_risk">Policy risk</option>
          </select>
          <label>Severity</label>
          <select value={feedbackSeverity} onChange={(e) => setFeedbackSeverity(e.target.value as any)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <label>Explanation (required)</label>
          <textarea value={feedbackExplanation} onChange={(e) => setFeedbackExplanation(e.target.value)} rows={3} />
          <div className="modal-actions">
            <button onClick={handleRaiseFeedback} className="btn-primary" disabled={!feedbackExplanation.trim()}>Submit</button>
            <button onClick={() => setShowFeedback(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
