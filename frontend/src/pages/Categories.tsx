import { useEffect, useState } from 'react';
import { Plus, Tags } from 'lucide-react';
import type { Category } from '../types';
import {
  getCategories,
  createCategory,
  deleteCategory,
} from '../api/category';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

export default function Categories() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch {
      showToast('Failed to load categories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setName('');
    setType('expense');
    setModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createCategory({ name, type });
      showToast('Category added', 'success');
      setModalOpen(false);
      await load();
    } catch {
      showToast('Failed to add category (must be unique per type).', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      showToast('Category deleted', 'success');
      await load();
    } catch {
      showToast('Failed to delete category.', 'error');
    }
  };

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Categories</h1>
        <Button onClick={openCreate}>
          <span className="btn-icon-label">
            <Plus size={16} /> Add Category
          </span>
        </Button>
      </div>

      <Card>
        <div className="card-header">
          <span className="card-title">Your Categories</span>
        </div>
        {loading ? (
          <SkeletonList rows={4} />
        ) : categories.length === 0 ? (
          <EmptyState
            icon={<Tags size={30} />}
            title="No categories yet"
            message="Group your income and expenses with custom categories."
            action={<Button onClick={openCreate}>Add your first category</Button>}
          />
        ) : (
          categories.map((c) => (
            <div className="list-row" key={c._id}>
              <span>
                <strong>{c.name}</strong>{' '}
                <Badge variant={c.type === 'income' ? 'success' : 'danger'}>
                  {c.type}
                </Badge>
              </span>
              <Button variant="danger" onClick={() => handleDelete(c._id)}>
                Delete
              </Button>
            </div>
          ))
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Category">
        <form className="stack" onSubmit={handleCreate}>
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Freelance"
            autoFocus
          />
          <div className="field">
            <label className="field-label">Type</label>
            <select
              className="field-input"
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <Button type="submit" loading={saving} fullWidth>
            Add Category
          </Button>
        </form>
      </Modal>
    </div>
  );
}
