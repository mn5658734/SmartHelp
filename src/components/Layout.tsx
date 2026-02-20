import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { mockUsers } from '../data/mockData';
import './Layout.css';

const agentNav = [
  { to: '/agent', end: true, label: 'Dashboard' },
  { to: '/agent/tickets', label: 'My Tickets' },
  { to: '/agent/queue', label: 'Team Queue' },
  { to: '/agent/escalations', label: 'Escalations' },
  { to: '/agent/feedback', label: 'Feedback' },
  { to: '/agent/settings', label: 'Settings' },
];

const adminNav = [
  { to: '/admin', end: true, label: 'Admin Dashboard' },
  { to: '/admin/sla', label: 'SLA & Policies' },
  { to: '/admin/teams', label: 'Teams & Roles' },
  { to: '/admin/categories', label: 'Categories & Routing' },
  { to: '/admin/workflow', label: 'Workflow Builder' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/insights', label: 'Insights' },
  { to: '/admin/audit', label: 'Audit Logs' },
  { to: '/admin/settings', label: 'Settings' },
];

export default function Layout() {
  const { currentUser, setCurrentUser } = useStore();
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';
  const nav = isAdmin ? adminNav : agentNav;

  const switchRole = () => {
    setCurrentUser(isAdmin ? mockUsers[0] : mockUsers[2]);
    navigate(isAdmin ? '/agent' : '/admin');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="logo-link">
            <svg className="home-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <h1 className="logo">SmartHelp</h1>
          </Link>
          <div className="role-toggle">
            <button
              type="button"
              className={`role-toggle-btn ${!isAdmin ? 'active' : ''}`}
              onClick={() => !isAdmin || switchRole()}
            >
              Agent
            </button>
            <button
              type="button"
              className={`role-toggle-btn ${isAdmin ? 'active' : ''}`}
              onClick={() => isAdmin || switchRole()}
            >
              Admin
            </button>
          </div>
        </div>
        <nav className="nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <NavLink to="/" className="back-home">
            ← Back to Home
          </NavLink>
          <div className="user-info">
            <span>{currentUser?.name}</span>
            <span className="user-email">{currentUser?.email}</span>
          </div>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
