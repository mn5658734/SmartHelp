import { create } from 'zustand';
import type { Ticket, User, Feedback, SLAConfig, Team, Category } from '../types';
import { mockTickets, mockUsers, mockFeedback, mockSLAConfigs, mockTeams, mockCategories } from '../data/mockData';

interface AppState {
  currentUser: User | null;
  tickets: Ticket[];
  feedback: Feedback[];
  slaConfigs: SLAConfig[];
  teams: Team[];
  categories: Category[];
  setCurrentUser: (user: User | null) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  addTicketMessage: (ticketId: string, message: Omit<Ticket['thread'][0], 'id' | 'createdAt'>) => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'submittedAt'>) => void;
  updateFeedback: (id: string, updates: Partial<Feedback>) => void;
  addTicket: (ticket: Ticket) => void;
  updateSLAConfig: (id: string, updates: Partial<SLAConfig>) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: mockUsers[0],
  tickets: mockTickets,
  feedback: mockFeedback,
  slaConfigs: mockSLAConfigs,
  teams: mockTeams,
  categories: mockCategories,
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
}));
