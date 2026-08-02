import api from './client';
import type { Budget } from '../types';

export const getBudgets = () => api.get<Budget[]>('/budgets');
export const createBudget = (data: Partial<Budget>) => api.post<Budget>('/budgets', data);
export const updateBudget = (id: string, data: Partial<Budget>) =>
  api.put<Budget>(`/budgets/${id}`, data);
export const deleteBudget = (id: string) => api.delete(`/budgets/${id}`);
