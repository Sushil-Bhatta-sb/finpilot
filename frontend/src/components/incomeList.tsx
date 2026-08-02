import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import type { Income } from '../types';
import { getIncomes, createIncome, deleteIncome } from '../api/income';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import EmptyState from './ui/EmptyState';
import { SkeletonList } from './ui/Skeleton';
import { useToast } from '../context/ToastContext';

interface Props {
  onTotalChange?: (total: number) => void;
}

export default function IncomeList({ onTotalChange }: Props) {
  const { showToast } = useToast();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getIncomes();
      setIncomes(res.data);
      onTotalChange?.(res.data.reduce((sum, i) => sum + i.amount, 0));
    } catch {
      showToast('Failed to load income.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    setSaving(true);
    try {
      await createIncome({ title, amount: Number(amount) });
      showToast('Income added', 'success');
      setTitle('');
      setAmount('');
      await load();
    } catch {
      showToast('Failed to add income.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIncome(id);
      showToast('Income deleted', 'success');
      await load();
    } catch {
      showToast('Failed to delete income.', 'error');
    }
  };

  return (
    <Card>
      <div className="card-header">
        <span className="card-title">Income</span>
      </div>

      <form className="inline-form" onSubmit={handleAdd}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (e.g. Salary)"
        />
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          type="number"
          min="0"
        />
        <Button type="submit" loading={saving}>
          Add
        </Button>
      </form>

      {loading ? (
        <SkeletonList rows={4} />
      ) : incomes.length === 0 ? (
        <EmptyState
          icon={<TrendingUp size={28} />}
          title="No income recorded yet"
          message="Add your first income entry using the form above."
        />
      ) : (
        <ul className="txn-list">
          {incomes.map((i) => (
            <li className="txn-item" key={i._id}>
              <div className="txn-main">
                <span className="txn-title">{i.title}</span>
                {i.category && <span className="txn-meta">{i.category}</span>}
              </div>
              <div className="txn-right">
                <span className="txn-amount income">Rs. {i.amount}</span>
                <Button variant="danger" onClick={() => handleDelete(i._id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

    </Card>
  );
}