export type UserRole = 'agent' | 'admin';
export type EscalationLevel = 'L1' | 'L2' | 'L3';
export type TicketStatus = 'New' | 'In Progress' | 'Waiting for SME' | 'Resolved' | 'Closed';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type FeedbackStatus = 'Submitted' | 'Reviewed' | 'Action Taken';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
  escalationLevel?: EscalationLevel;
}

export interface Team {
  id: string;
  name: string;
  categoryIds: string[];
  memberIds: string[];
}

export interface Category {
  id: string;
  name: string;
  teamId: string;
}

export interface Ticket {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: string;
  categoryId: string;
  priority: Priority;
  status: TicketStatus;
  escalationLevel: EscalationLevel;
  assignedTo?: string;
  assignedToName?: string;
  teamId?: string;
  aiConfidence: number;
  aiPredictedCategory?: string;
  slaDueAt: Date;
  slaFirstResponseDue?: Date;
  createdAt: Date;
  updatedAt: Date;
  thread: TicketMessage[];
  resolutionSummary?: string;
}

export interface TicketMessage {
  id: string;
  type: 'customer' | 'agent' | 'internal' | 'system';
  content: string;
  author?: string;
  createdAt: Date;
}

export interface Feedback {
  id: string;
  ticketId: string;
  type: 'wrong_category' | 'wrong_priority' | 'incorrect_response' | 'missing_context' | 'policy_risk';
  severity: 'low' | 'medium' | 'high';
  explanation: string;
  status: FeedbackStatus;
  submittedBy: string;
  submittedAt: Date;
  adminComments?: string;
}

export interface SLAConfig {
  id: string;
  categoryId: string;
  priority: Priority;
  firstResponseMinutes: number;
  resolutionMinutes: number;
  version: number;
}

export interface AuditLog {
  id: string;
  ticketId: string;
  action: string;
  userId: string;
  timestamp: Date;
  details?: Record<string, unknown>;
}
