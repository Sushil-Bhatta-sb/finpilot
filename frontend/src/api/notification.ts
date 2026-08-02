import api from './client';
import type { Notification } from '../types';

export const getNotifications = () => api.get<Notification[]>('/notifications');
export const markNotificationRead = (id: string) =>
  api.put<Notification>(`/notifications/${id}/read`);
export const deleteNotification = (id: string) => api.delete(`/notifications/${id}`);
