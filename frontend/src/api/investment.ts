import api from './client';
import type { Investment } from '../types';

export const getInvestments = () => api.get<Investment[]>('/investments');
export const createInvestment = (data: Partial<Investment>) =>
  api.post<Investment>('/investments', data);
export const updateInvestment = (id: string, data: Partial<Investment>) =>
  api.put<Investment>(`/investments/${id}`, data);
export const deleteInvestment = (id: string) => api.delete(`/investments/${id}`);
