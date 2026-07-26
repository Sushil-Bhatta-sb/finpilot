import api from './client';
import type { Expense } from '../types';

export const getExpenses = () => api.get<Expense[]>('/expenses');
export const createExpense = (data: Partial<Expense>) => api.post<Expense>('/expenses', data);
export const deleteExpense = (id: string) => api.delete(`/expenses/${id}`);