import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MyTickets from './pages/MyTickets';
import TeamQueue from './pages/TeamQueue';
import TicketDetail from './pages/TicketDetail';
import Escalations from './pages/Escalations';
import FeedbackQueue from './pages/FeedbackQueue';
import AgentSettings from './pages/AgentSettings';
import SLAConfig from './pages/SLAConfig';
import TeamsManagement from './pages/TeamsManagement';
import CategoriesRouting from './pages/CategoriesRouting';
import WorkflowBuilder from './pages/WorkflowBuilder';
import Reports from './pages/Reports';
import Insights from './pages/Insights';
import AuditLogs from './pages/AuditLogs';
import AdminSettings from './pages/AdminSettings';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agent" element={<Layout />}>
          <Route index element={<AgentDashboard />} />
          <Route path="tickets" element={<MyTickets />} />
          <Route path="tickets/:id" element={<TicketDetail />} />
          <Route path="queue" element={<TeamQueue />} />
          <Route path="escalations" element={<Escalations />} />
          <Route path="feedback" element={<FeedbackQueue />} />
          <Route path="settings" element={<AgentSettings />} />
        </Route>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="sla" element={<SLAConfig />} />
          <Route path="teams" element={<TeamsManagement />} />
          <Route path="categories" element={<CategoriesRouting />} />
          <Route path="workflow" element={<WorkflowBuilder />} />
          <Route path="reports" element={<Reports />} />
          <Route path="insights" element={<Insights />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
