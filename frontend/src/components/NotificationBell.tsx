import { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { markNotificationRead } from '../api/notification';
import type { Notification } from '../types';

export default function NotificationBell() {
  const { notifications, unreadCount, markRead } = useSocket();
  const [open, setOpen] = useState(false);

  const handleClick = async (n: Notification) => {
    if (!n.read) {
      markRead(n._id);
      try {
        await markNotificationRead(n._id);
      } catch {
        // optimistic update already applied; ignore network errors
      }
    }
  };

  return (
    <div className="notif-bell">
      <button
        className="notif-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          {notifications.length === 0 ? (
            <div className="notif-item">No notifications yet.</div>
          ) : (
            notifications.slice(0, 15).map((n) => (
              <div
                key={n._id}
                className={`notif-item${n.read ? '' : ' unread'}`}
                onClick={() => handleClick(n)}
              >
                <div>{n.message}</div>
                <div className="notif-time">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
