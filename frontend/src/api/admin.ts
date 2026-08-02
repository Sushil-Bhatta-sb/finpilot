import api from './client';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  suspended?: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalTransactions: number;
  totalBudgets: number;
  totalInvestments: number;
}

export interface MonthlyReportRow {
  _id: string;
  count: number;
  total?: number;
}

export interface AdminReports {
  transactions: MonthlyReportRow[];
  budgets: MonthlyReportRow[];
  investments: MonthlyReportRow[];
}

export const getAllUsers = () => api.get<AdminUser[]>('/admin/users');
export const deleteUser = (id: string) => api.delete(`/admin/users/${id}`);
export const suspendUser = (id: string) =>
  api.put<{ id: string; suspended: boolean }>(`/admin/users/${id}/suspend`);
export const getAdminReports = () => api.get<AdminReports>('/admin/reports');
export const getAdminStats = () => api.get<AdminStats>('/admin/stats');
