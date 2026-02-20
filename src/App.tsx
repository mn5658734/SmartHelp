import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PlaceholderPage from './pages/PlaceholderPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agent" element={<Layout />}>
          <Route index element={<AgentDashboard />} />
          <Route path="tickets" element={<PlaceholderPage title="My Tickets" description="View and manage your assigned tickets" />} />
          <Route path="queue" element={<PlaceholderPage title="Team Queue" description="Tickets in your team's queue" />} />
          <Route path="escalations" element={<PlaceholderPage title="Escalations" description="Pending escalations" />} />
          <Route path="feedback" element={<PlaceholderPage title="Feedback" description="Human-in-loop feedback queue" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" description="Profile and notifications" />} />
        </Route>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="sla" element={<PlaceholderPage title="SLA & Policies" description="Configure SLA rules and policies" />} />
          <Route path="teams" element={<PlaceholderPage title="Teams & Roles" description="Manage teams and members" />} />
          <Route path="categories" element={<PlaceholderPage title="Categories & Routing" description="Define categories and routing rules" />} />
          <Route path="workflow" element={<PlaceholderPage title="Workflow Builder" description="Build ticket resolution workflows" />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" description="Download reports with filters" />} />
          <Route path="insights" element={<PlaceholderPage title="Insights & Analytics" description="Analytics and trends" />} />
          <Route path="audit" element={<PlaceholderPage title="Audit Logs" description="System audit trail" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" description="Admin settings" />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
