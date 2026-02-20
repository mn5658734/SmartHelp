import { useState } from 'react';
import './AdminPages.css';

const STATES = ['New', 'In Progress', 'Waiting for SME', 'Resolved', 'Closed'];

export default function WorkflowBuilder() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Workflow Builder</h1>
        <p className="page-subtitle">Define ticket resolution flow, transitions and automated actions</p>
      </div>
      <div className="workflow-builder">
        <div className="workflow-states">
          <h3>States</h3>
          {STATES.map((s) => (
            <div
              key={s}
              className={`workflow-state ${selectedState === s ? 'selected' : ''}`}
              onClick={() => setSelectedState(s)}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="workflow-detail">
          {selectedState ? (
            <>
              <h3>Transitions from {selectedState}</h3>
              <div className="transition-list">
                {STATES.filter((x) => x !== selectedState).map((target) => (
                  <div key={target} className="transition-item">
                    <span>{selectedState} → {target}</span>
                    <span className="badge">Allowed</span>
                  </div>
                ))}
              </div>
              <h4>Automated actions</h4>
              <ul>
                <li>Send acknowledgment (New → In Progress)</li>
                <li>Assign to team (on category match)</li>
                <li>Notify escalation (on SLA breach risk)</li>
                <li>Trigger clarification email (Waiting for SME)</li>
              </ul>
              <p className="workflow-note">Workflow versioning and publish/rollback coming soon.</p>
            </>
          ) : (
            <p className="placeholder-text">Select a state to configure transitions.</p>
          )}
        </div>
      </div>
    </div>
  );
}
