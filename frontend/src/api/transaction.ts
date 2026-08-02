import api from './client';
import type { Transaction } from '../types';

export interface TransactionFilters {
  search?: string;
  category?: string;
  type?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export const getTransactions = (params: TransactionFilters = {}) =>
  api.get<Transaction[]>('/transactions', { params });

// Fetch export as a Blob so it can be downloaded from the browser.
export const exportCSV = () => api.get('/transactions/export/csv', { responseType: 'blob' });
export const exportPDF = () => api.get('/transactions/export/pdf', { responseType: 'blob' });
