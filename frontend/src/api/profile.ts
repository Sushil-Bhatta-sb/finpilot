import api from './client';
import type { UserProfile } from '../types';

export const getProfile = () => api.get<UserProfile>('/profile');
export const updateProfile = (data: Partial<UserProfile>) =>
  api.put<UserProfile>('/profile', data);
export const changePassword = (currentPassword: string, newPassword: string) =>
  api.put<{ message: string }>('/profile/change-password', { currentPassword, newPassword });
