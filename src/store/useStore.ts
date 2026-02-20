import { create } from 'zustand';
import type { Ticket, User, Feedback, SLAConfig, Team, Category, AuditLog } from '../types';
import { mockTickets, mockUsers, mockFeedback, mockSLAConfigs, mockTeams, mockCategories } from '../data/mockData';

interface AppState {
  currentUser: User | null;
  tickets: Ticket[];
  feedback: Feedback[];
  slaConfigs: SLAConfig[];
  teams: Team[];
  categories: Category[];
  auditLogs: AuditLog[];
  setCurrentUser: (user: User | null) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  addTicketMessage: (ticketId: string, message: Omit<Ticket['thread'][0], 'id' | 'createdAt'>) => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'submittedAt'>) => void;
  updateFeedback: (id: string, updates: Partial<Feedback>) => void;
  addTicket: (ticket: Ticket) => void;
  updateSLAConfig: (id: string, updates: Partial<SLAConfig>) => void;
  addSLAConfig: (config: Omit<SLAConfig, 'id'>) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
}

const mockAuditLogs: AuditLog[] = [
  { id: 'a1', ticketId: 'TKT-1001', action: 'Status changed to In Progress', userId: 'u1', timestamp: new Date(Date.now() - 30 * 60 * 1000) },
  { id: 'a2', ticketId: 'TKT-1003', action: 'Escalated to L2', userId: 'u1', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: 'a3', ticketId: 'TKT-1001', action: 'Assigned to Alice Chen', userId: 'u3', timestamp: new Date(Date.now() - 60 * 60 * 1000) },
];

export const useStore = create<AppState>((set) => ({
  currentUser: mockUsers[0],
  tickets: mockTickets,
  feedback: mockFeedback,
  slaConfigs: mockSLAConfigs,
  teams: mockTeams,
  categories: mockCategories,
  auditLogs: mockAuditLogs,
  setCurrentUser: (user) => set({ currentUser: user }),
  updateTicket: (id, updates) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      ),
    })),
  addTicketMessage: (ticketId, message) =>
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              thread: [
                ...t.thread,
                {
                  ...message,
                  id: `m${Date.now()}`,
                  createdAt: new Date(),
                },
              ],
              updatedAt: new Date(),
            }
          : t
      ),
    })),
  addFeedback: (fb) =>
    set((s) => ({
      feedback: [
        ...s.feedback,
        {
          ...fb,
          id: `f${Date.now()}`,
          submittedAt: new Date(),
        },
      ],
    })),
  updateFeedback: (id, updates) =>
    set((s) => ({
      feedback: s.feedback.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),
  addTicket: (ticket) => set((s) => ({ tickets: [...s.tickets, ticket] })),
  updateSLAConfig: (id, updates) =>
    set((s) => ({
      slaConfigs: s.slaConfigs.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  addSLAConfig: (config) =>
    set((s) => ({
      slaConfigs: [...s.slaConfigs, { ...config, id: `sla${Date.now()}` }],
    })),
  updateTeam: (id, updates) =>
    set((s) => ({
      teams: s.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  addTeam: (team) =>
    set((s) => ({
      teams: [...s.teams, { ...team, id: `t${Date.now()}` }],
    })),
  updateCategory: (id, updates) =>
    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  addCategory: (cat) =>
    set((s) => {
      const newId = `c${Date.now()}`;
      const newCategories = [...s.categories, { ...cat, id: newId }];
      const newTeams = cat.teamId
        ? s.teams.map((t) =>
            t.id === cat.teamId ? { ...t, categoryIds: [...t.categoryIds, newId] } : t
          )
        : s.teams;
      return { categories: newCategories, teams: newTeams };
    }),
  addAuditLog: (log) =>
    set((s) => ({
      auditLogs: [...s.auditLogs, { ...log, id: `a${Date.now()}`, timestamp: new Date() }],
    })),
}));
