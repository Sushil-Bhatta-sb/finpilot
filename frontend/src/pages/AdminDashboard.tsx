import { useEffect, useState } from 'react';
import {
  getAllUsers,
  deleteUser,
  suspendUser,
  getAdminStats,
  type AdminUser,
  type AdminStats,
} from '../api/admin';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, statsRes] = await Promise.all([getAllUsers(), getAdminStats()]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch {
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      await load();
    } catch {
      setError('Failed to delete user.');
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await suspendUser(id);
      await load();
    } catch {
      setError('Failed to update user.');
    }
  };

  if (loading) return <Spinner label="Loading admin dashboard…" />;

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Admin Dashboard</h1>
      </div>

      {stats && (
        <div className="grid-4">
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Transactions</div>
            <div className="stat-value">{stats.totalTransactions}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Budgets</div>
            <div className="stat-value">{stats.totalBudgets}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Investments</div>
            <div className="stat-value">{stats.totalInvestments}</div>
          </div>
        </div>
      )}

      <Card>
        <div className="card-header">
          <span className="card-title">Users</span>
        </div>
        {error && <p className="error-text">{error}</p>}
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className="badge">{u.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${u.suspended ? 'danger' : 'success'}`}>
                      {u.suspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <span className="row-actions">
                      <Button variant="secondary" onClick={() => handleSuspend(u._id)}>
                        {u.suspended ? 'Unsuspend' : 'Suspend'}
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(u._id)}>
                        Delete
                      </Button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
