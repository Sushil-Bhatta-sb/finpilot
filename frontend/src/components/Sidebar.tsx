import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/income', label: 'Income' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/budgets', label: 'Budgets' },
  { to: '/savings', label: 'Savings' },
  { to: '/investments', label: 'Investments' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/categories', label: 'Categories' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/profile', label: 'Profile' },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">F</span>
        FinPilot
      </div>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}
        >
          {link.label}
        </NavLink>
      ))}
      {user?.role === 'admin' && (
        <NavLink
          to="/admin"
          className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}
        >
          Admin
        </NavLink>
      )}
    </aside>
  );
}
