import { useEffect, useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import type { Budget } from '../types';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../api/budget';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

const currentMonth = new Date().toISOString().slice(0, 7);

export default function Budgets() {
  const { showToast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState(currentMonth);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getBudgets();
      setBudgets(res.data);
    } catch {
      showToast('Failed to load budgets.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setCategory('');
    setLimit('');
    setMonth(currentMonth);
    setModalOpen(true);
  };

  const openEdit = (b: Budget) => {
    setEditingId(b._id);
    setCategory(b.category);
    setLimit(String(b.limit));
    setMonth(b.month);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim() || !limit || !month) return;
    setSaving(true);
    try {
      const payload = { category, limit: Number(limit), month };
      if (editingId) await updateBudget(editingId, payload);
      else await createBudget(payload);
      showToast(editingId ? 'Budget updated' : 'Budget created', 'success');
      setModalOpen(false);
      await load();
    } catch {
      showToast('Failed to save budget. Category + month must be unique.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id);
      showToast('Budget deleted', 'success');
      await load();
    } catch {
      showToast('Failed to delete budget.', 'error');
    }
  };

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Budgets</h1>
        <Button onClick={openCreate}>
          <span className="btn-icon-label">
            <Plus size={16} /> Add Budget
          </span>
        </Button>
      </div>

      <Card>
        <div className="card-header">
          <span className="card-title">Your Budgets</span>
        </div>
        {loading ? (
          <SkeletonList rows={4} />
        ) : budgets.length === 0 ? (
          <EmptyState
            icon={<Wallet size={30} />}
            title="No budgets yet"
            message="Set a monthly limit per category to track your spending."
            action={<Button onClick={openCreate}>Add your first budget</Button>}
          />
        ) : (
          budgets.map((b) => {
            const percent = b.limit ? Math.round((b.spent / b.limit) * 100) : 0;
            const exceeded = b.spent > b.limit;
            const cls = exceeded ? 'danger' : percent >= 80 ? 'warn' : '';
            return (
              <div className="progress-row" key={b._id}>
                <div className="progress-meta">
                  <span>
                    <strong>{b.category}</strong> <span className="muted">({b.month})</span>
                    {exceeded && (
                      <Badge variant="danger" className="ml-8">
                        Exceeded
                      </Badge>
                    )}
                  </span>
                  <span className="row-actions">
                    Rs. {b.spent} / {b.limit} ({percent}%)
                    <Button variant="secondary" onClick={() => openEdit(b)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(b._id)}>
                      Delete
                    </Button>
                  </span>
                </div>
                <div className="progress">
                  <div
                    className={`progress-bar ${cls}`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Budget' : 'New Budget'}
      >
        <form className="stack" onSubmit={handleSubmit}>
          <Input
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Groceries"
            autoFocus
          />
          <Input
            label="Limit"
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="10000"
          />
          <Input
            label="Month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <Button type="submit" loading={saving} fullWidth>
            {editingId ? 'Update Budget' : 'Add Budget'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
