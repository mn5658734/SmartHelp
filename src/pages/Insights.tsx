import { useStore } from '../store/useStore';
import './AdminPages.css';

export default function Insights() {
  const { tickets, feedback } = useStore();

  const byCategory = tickets.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + 1;
    return acc;
  }, {});

  const topCategories = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const breached = tickets.filter(
    (t) => new Date(t.slaDueAt) < new Date() && t.status !== 'Closed' && t.status !== 'Resolved'
  ).length;

  const lowConfidence = tickets.filter((t) => t.aiConfidence < 0.7).length;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Insights & Analytics</h1>
        <p className="page-subtitle">Common issues, trends, and AI adoption metrics</p>
      </div>
      <div className="insights-grid">
        <div className="insight-card">
          <h4>Top Categories (by volume)</h4>
          <ul>
            {topCategories.map(([cat, count]) => (
              <li key={cat}><span>{cat}</span><span>{count}</span></li>
            ))}
          </ul>
        </div>
        <div className="insight-card">
          <h4>Key Metrics</h4>
          <div className="metric-row">
            <span>SLA Breaches</span>
            <strong>{breached}</strong>
          </div>
          <div className="metric-row">
            <span>Low AI Confidence</span>
            <strong>{lowConfidence}</strong>
          </div>
          <div className="metric-row">
            <span>Feedback Submitted</span>
            <strong>{feedback.length}</strong>
          </div>
        </div>
        <div className="insight-card">
          <h4>AI Adoption</h4>
          <p>Auto-suggest accepted: —</p>
          <p>Confidence trends: Monitor low-confidence tickets for model improvement.</p>
        </div>
      </div>
    </div>
  );
}
