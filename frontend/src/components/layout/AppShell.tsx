import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Sun, Moon, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from '../NotificationBell';
import Sidebar from './Sidebar';

export default function AppShell() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [search, setSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the mobile drawer + user menu whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
    setUserMenu(false);
  }, [location.pathname]);

  // Close the user dropdown on outside click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenu(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const initials = (user?.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // On mobile the menu button opens the drawer; on desktop it toggles collapse.
  const handleMenuToggle = () => {
    if (window.innerWidth <= 768) setMobileOpen((o) => !o);
    else setCollapsed((c) => !c);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/transactions');
  };

  return (
    <div className="shell">
      <div className="sb-desktop">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
      </div>

      <div className="shell-main">
        <header className="shell-topbar">
          <div className="shell-topbar-left">
            <button
              type="button"
              className="shell-menu-btn"
              onClick={handleMenuToggle}
              aria-label="Toggle navigation"
            >
              <Menu size={20} />
            </button>
            <span className="shell-logo">
              <span className="sb-brand-mark">F</span>
              FinPilot
            </span>
          </div>

          <form className="shell-search" onSubmit={handleSearch} role="search">
            <Search size={16} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions…"
              aria-label="Search transactions"
            />
          </form>

          <div className="shell-topbar-right">
            <NotificationBell />

            <div className="shell-user" ref={menuRef}>
              <button
                type="button"
                className="shell-user-btn"
                onClick={() => setUserMenu((o) => !o)}
              >
                <span className="shell-avatar">{initials}</span>
                <span className="shell-user-name">{user?.name}</span>
                <ChevronDown size={15} />
              </button>
              {userMenu && (
                <div className="shell-user-menu">
                  <button type="button" onClick={() => navigate('/profile')}>
                    <User size={16} /> Profile
                  </button>
                  <button type="button" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </button>
                  <button type="button" className="danger" onClick={logout}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="shell-page">
          <Outlet />
        </main>
      </div>

      {mobileOpen && (
        <div className="sb-drawer-scrim" onClick={() => setMobileOpen(false)} />
      )}
      <div className={`sb-drawer${mobileOpen ? ' open' : ''}`}>
        <Sidebar
          collapsed={false}
          forceExpanded
          onToggleCollapse={() => {}}
          onNavigate={() => setMobileOpen(false)}
        />
      </div>
    </div>
  );
}
