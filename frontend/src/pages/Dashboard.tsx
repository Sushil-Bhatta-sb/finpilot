import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  LineChart,
  ArrowUpRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getDashboardStats } from '../api/dashboard';
import type { DashboardStats } from '../types';
import { useAuth } from '../context/AuthContext';
import { SkeletonCards } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import QuickAdd from '../components/QuickAdd';
import { IncomeExpenseBar, SpendingLine, CategoryPie } from '../components/Charts';

type Period = 'this-month' | 'last-month' | 'this-year';
type Accent = 'income' | 'expense' | 'primary' | 'savings' | 'invest';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'this-year', label: 'This Year' },
];

const money = (n: number) => `Rs. ${Math.round(n || 0).toLocaleString('en-IN')}`;

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<Period>('this-month');
  const [quickAdd, setQuickAdd] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [period, load]);

  return (
    <div className="stack">
      <div className="dash-hero">
        <div className="dash-hero-text">
          <p className="dash-hero-eyebrow">{greeting()},</p>
          <h1 className="dash-hero-name">{user?.name || 'there'} 👋</h1>
          <p className="dash-hero-sub">Here's your financial overview at a glance.</p>
        </div>
        <div className="period-tabs">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              className={`period-tab${period === p.value ? ' active' : ''}`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonCards count={5} />
      ) : error || !stats ? (
        <EmptyState title="No data" message={error || 'Nothing to show yet.'} />
      ) : (
        <DashboardBody stats={stats} navigate={navigate} />
      )}

      <button
        type="button"
        className="fab"
        onClick={() => setQuickAdd(true)}
        aria-label="Quick add"
      >
        <Plus size={22} />
      </button>

      <QuickAdd
        open={quickAdd}
        onClose={() => setQuickAdd(false)}
        onAdded={load}
      />
    </div>
  );
}

function DashboardBody({
  stats,
  navigate,
}: {
  stats: DashboardStats;
  navigate: (to: string) => void;
}) {
  const spendingByDay = new Map<string, number>();
  stats.recentTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const label = new Date(t.date).toISOString().slice(0, 10);
      spendingByDay.set(label, (spendingByDay.get(label) || 0) + (t.amount || 0));
    });
  const spendingLine = Array.from(spendingByDay.entries())
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const categoryData = stats.budgetProgress.map((b) => ({
    name: b.category,
    value: b.spent,
  }));

  return (
    <>
      <div className="stat-grid">
        <StatCard
          label="Total Income"
          value={stats.totalIncome}
          accent="income"
          icon={TrendingUp}
          onClick={() => navigate('/income')}
        />
        <StatCard
          label="Total Expense"
          value={stats.totalExpense}
          accent="expense"
          icon={TrendingDown}
          onClick={() => navigate('/expenses')}
        />
        <StatCard
          label="Remaining Balance"
          value={stats.currentBalance}
          accent="primary"
          icon={Wallet}
          onClick={() => navigate('/transactions')}
        />
        <StatCard
          label="Savings"
          value={stats.totalSavings}
          accent="savings"
          icon={PiggyBank}
          onClick={() => navigate('/savings')}
        />
        <StatCard
          label="Investments"
          value={stats.totalInvestmentValue}
          accent="invest"
          icon={LineChart}
          onClick={() => navigate('/investments')}
        />
      </div>

      <div className="grid-2">
        <div className="chart-card">
          <h3>Income vs Expense</h3>
          <IncomeExpenseBar income={stats.totalIncome} expense={stats.totalExpense} />
        </div>
        <div className="chart-card">
          <h3>Recent Spending</h3>
          {spendingLine.length ? (
            <SpendingLine data={spendingLine} />
          ) : (
            <p className="empty-state">No recent spending.</p>
          )}
        </div>
        <div className="chart-card">
          <h3>Category Wise Spending</h3>
          <CategoryPie data={categoryData} />
        </div>
        <div className="chart-card">
          <h3>Budget Usage</h3>
          {stats.budgetProgress.length === 0 && (
            <p className="empty-state">No budgets set.</p>
          )}
          {stats.budgetProgress.map((b) => {
            const cls = b.percentUsed >= 100 ? 'danger' : b.percentUsed >= 80 ? 'warn' : '';
            return (
              <div className="progress-row" key={b.category}>
                <div className="progress-meta">
                  <span>{b.category}</span>
                  <span>
                    Rs. {b.spent} / {b.limit} ({b.percentUsed}%)
                  </span>
                </div>
                <div className="progress">
                  <div
                    className={`progress-bar ${cls}`}
                    style={{ width: `${Math.min(b.percentUsed, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="chart-card">
        <div className="section-head">
          <h3>Recent Transactions</h3>
          <button
            type="button"
            className="link-btn"
            onClick={() => navigate('/transactions')}
          >
            View all
          </button>
        </div>
        {stats.recentTransactions.length === 0 ? (
          <p className="empty-state">No transactions yet.</p>
        ) : (
          <div className="recent-list">
            {stats.recentTransactions.slice(0, 6).map((t) => (
              <div
                key={t._id}
                className="recent-row"
                role="button"
                tabIndex={0}
                onClick={() => navigate('/transactions')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigate('/transactions');
                }}
              >
                <div className="recent-main">
                  <Badge variant={t.type === 'income' ? 'success' : 'danger'}>
                    {t.type}
                  </Badge>
                  <span className="recent-title">{t.description || t.type}</span>
                </div>
                <div className="recent-side">
                  <span className={t.type === 'income' ? 'income' : 'expense'}>
                    {t.type === 'income' ? '+' : '-'}{money(t.amount || 0)}
                  </span>
                  <span className="recent-date">
                    {new Date(t.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  accent,
  icon: Icon,
  onClick,
}: {
  label: string;
  value: number;
  accent: Accent;
  icon: LucideIcon;
  onClick?: () => void;
}) {
  return (
    <div
      className={`stat-card stat-card-pro accent-${accent}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="stat-top">
        <span className="stat-icon">
          <Icon size={20} />
        </span>
        <ArrowUpRight size={16} className="stat-go" />
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{money(value)}</div>
    </div>
  );
}
