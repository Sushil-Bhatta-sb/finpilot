import api from './client';
import type { Income } from '../types';

export const getIncomes = () => api.get<Income[]>('/income');
export const createIncome = (data: Partial<Income>) => api.post<Income>('/income', data);
export const deleteIncome = (id: string) => api.delete(`/income/${id}`);