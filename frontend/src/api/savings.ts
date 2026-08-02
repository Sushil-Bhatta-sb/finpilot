import api from './client';
import type { SavingsGoal } from '../types';

export const getGoals = () => api.get<SavingsGoal[]>('/savings');
export const createGoal = (data: Partial<SavingsGoal>) => api.post<SavingsGoal>('/savings', data);
export const updateGoal = (id: string, data: Partial<SavingsGoal>) =>
  api.put<SavingsGoal>(`/savings/${id}`, data);
export const deleteGoal = (id: string) => api.delete(`/savings/${id}`);
export const depositToGoal = (id: string, amount: number) =>
  api.post<SavingsGoal>(`/savings/${id}/deposit`, { amount });
