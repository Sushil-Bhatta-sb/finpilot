import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';
import Button from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <header className="app-topbar">
          <span className="muted">Welcome, {user?.name}</span>
          <div className="topbar-user">
            <Button variant="ghost" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </Button>
            <NotificationBell />
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
