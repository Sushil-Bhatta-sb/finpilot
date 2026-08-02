import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  LineChart,
  Receipt,
  Tags,
  BarChart3,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Sprout,
  Archive,
  PieChart,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

interface NavLeaf {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

interface NavGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  items: NavLeaf[];
}

const DASHBOARD: NavLeaf = {
  to: '/',
  label: 'Dashboard',
  icon: LayoutDashboard,
  end: true,
};

const GROUPS: NavGroup[] = [
  {
    id: 'money',
    label: 'Money',
    icon: CircleDollarSign,
    items: [
      { to: '/income', label: 'Income', icon: TrendingUp },
      { to: '/expenses', label: 'Expenses', icon: TrendingDown },
      { to: '/budgets', label: 'Budgets', icon: Wallet },
    ],
  },
  {
    id: 'growth',
    label: 'Growth',
    icon: Sprout,
    items: [
      { to: '/savings', label: 'Savings Goals', icon: PiggyBank },
      { to: '/investments', label: 'Investments', icon: LineChart },
    ],
  },
  {
    id: 'records',
    label: 'Records',
    icon: Archive,
    items: [
      { to: '/transactions', label: 'Transactions', icon: Receipt },
      { to: '/categories', label: 'Categories', icon: Tags },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: PieChart,
    items: [{ to: '/analytics', label: 'Analytics', icon: BarChart3 }],
  },
];

const DEFAULT_EXPANDED: Record<string, boolean> = {
  money: true,
  growth: false,
  records: false,
  insights: false,
};

function groupForPath(path: string): string | null {
  for (const g of GROUPS) {
    if (g.items.some((it) => it.to === path)) return g.id;
  }
  return null;
}

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  /** Called after any link click (used to close the mobile drawer). */
  onNavigate?: () => void;
  /** Force the expanded grouped view regardless of `collapsed` (mobile drawer). */
  forceExpanded?: boolean;
}

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  onNavigate,
  forceExpanded = false,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isCollapsed = collapsed && !forceExpanded;

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const active = groupForPath(location.pathname);
    return active
      ? { ...DEFAULT_EXPANDED, [active]: true }
      : { ...DEFAULT_EXPANDED };
  });

  // Auto-expand the group that contains the active route.
  useEffect(() => {
    const active = groupForPath(location.pathname);
    if (active) {
      setExpanded((prev) => (prev[active] ? prev : { ...prev, [active]: true }));
    }
  }, [location.pathname]);

  const toggleGroup = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside className={`sb${isCollapsed ? ' sb-collapsed' : ''}`}>
      <div className="sb-head">
        {!isCollapsed && (
          <div className="sb-brand">
            <span className="sb-brand-mark">F</span>
            <span className="sb-brand-name">FinPilot</span>
          </div>
        )}
        {!forceExpanded && (
          <button
            type="button"
            className="sb-collapse"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>

      <nav className="sb-scroll">
        {!isCollapsed && <p className="sb-section-label">Overview</p>}
        <SidebarLink item={DASHBOARD} collapsed={isCollapsed} onNavigate={onNavigate} />

        {GROUPS.map((g) =>
          isCollapsed ? (
            <RailGroup
              key={g.id}
              group={g}
              activePath={location.pathname}
              onNavigate={onNavigate}
            />
          ) : (
            <ExpandedGroup
              key={g.id}
              group={g}
              open={!!expanded[g.id]}
              onToggle={() => toggleGroup(g.id)}
              onNavigate={onNavigate}
            />
          ),
        )}
      </nav>

      <div className="sb-account">
        {!isCollapsed && <p className="sb-section-label">Account</p>}
        <SidebarLink
          item={{ to: '/profile', label: 'Profile', icon: User }}
          collapsed={isCollapsed}
          onNavigate={onNavigate}
        />
        {user?.role === 'admin' && (
          <SidebarLink
            item={{ to: '/admin', label: 'Admin Panel', icon: ShieldCheck }}
            collapsed={isCollapsed}
            onNavigate={onNavigate}
          />
        )}
        <button
          type="button"
          className="sb-link sb-logout"
          onClick={logout}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="sb-link-icon" />
          {!isCollapsed && <span className="sb-link-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavLeaf;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}
      title={collapsed ? item.label : undefined}
    >
      <Icon size={18} className="sb-link-icon" />
      {!collapsed && <span className="sb-link-label">{item.label}</span>}
    </NavLink>
  );
}

function ExpandedGroup({
  group,
  open,
  onToggle,
  onNavigate,
}: {
  group: NavGroup;
  open: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="sb-grp">
      <button
        type="button"
        className="sb-group-header"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="sb-group-title">{group.label}</span>
        <ChevronDown size={14} className={`sb-chevron${open ? ' open' : ''}`} />
      </button>
      <div className={`sb-group-body${open ? ' open' : ''}`}>
        <div className="sb-group-inner">
          {group.items.map((it) => (
            <SidebarLink key={it.to} item={it} collapsed={false} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RailGroup({
  group,
  activePath,
  onNavigate,
}: {
  group: NavGroup;
  activePath: string;
  onNavigate?: () => void;
}) {
  const Icon = group.icon;
  const active = group.items.some((it) => it.to === activePath);
  return (
    <div className="sb-rail-item">
      <button
        type="button"
        className={`sb-rail-btn${active ? ' active' : ''}`}
        aria-label={group.label}
      >
        <Icon size={18} className="sb-link-icon" />
      </button>
      <div className="sb-flyout" role="menu">
        <p className="sb-flyout-title">{group.label}</p>
        {group.items.map((it) => (
          <SidebarLink key={it.to} item={it} collapsed={false} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}
