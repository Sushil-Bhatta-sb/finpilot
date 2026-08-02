import api from './client';
import type { Category } from '../types';

export const getCategories = () => api.get<Category[]>('/categories');
export const createCategory = (data: Partial<Category>) => api.post<Category>('/categories', data);
export const updateCategory = (id: string, data: Partial<Category>) =>
  api.put<Category>(`/categories/${id}`, data);
export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);
