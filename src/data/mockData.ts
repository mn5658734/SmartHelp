import type { Ticket, User, Team, Category, Feedback, SLAConfig } from '../types';

const now = new Date();
const twoHours = (d: Date) => new Date(d.getTime() + 2 * 60 * 60 * 1000);
const oneDay = (d: Date) => new Date(d.getTime() + 24 * 60 * 60 * 1000);

export const mockUsers: User[] = [
  { id: 'u1', name: 'Alice Chen', email: 'alice@support.com', role: 'agent', teamId: 't1', escalationLevel: 'L1' },
  { id: 'u2', name: 'Bob Smith', email: 'bob@support.com', role: 'agent', teamId: 't1', escalationLevel: 'L2' },
  { id: 'u3', name: 'Carol Admin', email: 'carol@support.com', role: 'admin' },
];

export const mockTeams: Team[] = [
  { id: 't1', name: 'Billing Support', categoryIds: ['c1', 'c2'], memberIds: ['u1', 'u2'] },
  { id: 't2', name: 'Technical Support', categoryIds: ['c3'], memberIds: [] },
];

export const mockCategories: Category[] = [
  { id: 'c1', name: 'Billing', teamId: 't1' },
  { id: 'c2', name: 'Refunds', teamId: 't1' },
  { id: 'c3', name: 'Technical', teamId: 't2' },
];

export const mockTickets: Ticket[] = [
  {
    id: 'TKT-1001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    subject: 'Incorrect charge on my account',
    category: 'Billing',
    categoryId: 'c1',
    priority: 'High',
    status: 'In Progress',
    escalationLevel: 'L1',
    assignedTo: 'u1',
    assignedToName: 'Alice Chen',
    teamId: 't1',
    aiConfidence: 0.92,
    aiPredictedCategory: 'Billing',
    slaDueAt: twoHours(now),
    slaFirstResponseDue: new Date(now.getTime() + 30 * 60 * 1000),
    createdAt: new Date(now.getTime() - 60 * 60 * 1000),
    updatedAt: now,
    thread: [
      { id: 'm1', type: 'customer', content: 'I was charged twice for my subscription. Please refund.', author: 'John Doe', createdAt: new Date(now.getTime() - 60 * 60 * 1000) },
      { id: 'm2', type: 'agent', content: 'Looking into this now. Can you share the transaction ID?', author: 'Alice Chen', createdAt: new Date(now.getTime() - 45 * 60 * 1000) },
    ],
  },
  {
    id: 'TKT-1002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    subject: 'Login issues',
    category: 'Technical',
    categoryId: 'c3',
    priority: 'Medium',
    status: 'New',
    escalationLevel: 'L1',
    assignedTo: undefined,
    assignedToName: undefined,
    teamId: 't2',
    aiConfidence: 0.65,
    aiPredictedCategory: 'Technical',
    slaDueAt: oneDay(now),
    createdAt: new Date(now.getTime() - 15 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 15 * 60 * 1000),
    thread: [
      { id: 'm3', type: 'customer', content: 'I cannot log in to my account. Getting error 500.', author: 'Jane Smith', createdAt: new Date(now.getTime() - 15 * 60 * 1000) },
    ],
  },
  {
    id: 'TKT-1003',
    customerName: 'Mike Wilson',
    customerEmail: 'mike@example.com',
    subject: 'Refund request',
    category: 'Refunds',
    categoryId: 'c2',
    priority: 'Low',
    status: 'Waiting for SME',
    escalationLevel: 'L2',
    assignedTo: 'u2',
    assignedToName: 'Bob Smith',
    teamId: 't1',
    aiConfidence: 0.88,
    slaDueAt: new Date(now.getTime() - 60 * 60 * 1000),
    createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    updatedAt: now,
    thread: [
      { id: 'm4', type: 'customer', content: 'Requesting refund for order #12345', author: 'Mike Wilson', createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000) },
      { id: 'm5', type: 'system', content: 'Clarification requested from SME', createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
    ],
  },
];

export const mockFeedback: Feedback[] = [
  {
    id: 'f1',
    ticketId: 'TKT-1001',
    type: 'wrong_priority',
    severity: 'medium',
    explanation: 'AI suggested Low but customer mentioned urgent billing issue',
    status: 'Reviewed',
    submittedBy: 'Alice Chen',
    submittedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    adminComments: 'Updated priority rules for billing keywords',
  },
];

export const mockSLAConfigs: SLAConfig[] = [
  { id: 'sla1', categoryId: 'c1', priority: 'High', firstResponseMinutes: 30, resolutionMinutes: 240, version: 1 },
  { id: 'sla2', categoryId: 'c1', priority: 'Medium', firstResponseMinutes: 60, resolutionMinutes: 480, version: 1 },
  { id: 'sla3', categoryId: 'c3', priority: 'High', firstResponseMinutes: 30, resolutionMinutes: 360, version: 1 },
];
