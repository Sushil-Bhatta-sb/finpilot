import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import type { Notification } from '../types';
import { getNotifications } from '../api/notification';

interface SocketContextValue {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  removeNotification: (id: string) => void;
  refresh: () => void;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

// Socket.io server lives at the API host without the trailing `/api` path.
const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(
  /\/api\/?$/,
  ''
);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refresh = () => {
    getNotifications()
      .then((res) => setNotifications(res.data))
      .catch(() => setNotifications([]));
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }

    // Load existing notifications, then open a live connection.
    refresh();

    const socket: Socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socket.emit('join', user.id);
    socket.on('notification', (payload: Notification) => {
      setNotifications((prev) => [payload, ...prev]);
      const type =
        payload.type === 'budget-alert'
          ? 'warning'
          : payload.type === 'goal-completed'
            ? 'success'
            : 'info';
      showToast(payload.message, type);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SocketContext.Provider
      value={{ notifications, unreadCount, markRead, removeNotification, refresh }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): SocketContextValue {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
}
