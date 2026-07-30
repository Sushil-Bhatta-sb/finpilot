import { useEffect, useState } from 'react';
import type { Income } from '../types';
import { getIncomes, createIncome, deleteIncome } from '../api/income';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Spinner from './ui/Spinner';

interface Props {
  onTotalChange?: (total: number) => void;
}

export default function IncomeList({ onTotalChange }: Props) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getIncomes();
      setIncomes(res.data);
      onTotalChange?.(res.data.reduce((sum, i) => sum + i.amount, 0));
    } catch {
      setError('Failed to load income.');
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
    setError('');
    try {
      await createIncome({ title, amount: Number(amount) });
      setTitle('');
      setAmount('');
      await load();
    } catch {
      setError('Failed to add income.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIncome(id);
      await load();
    } catch {
      setError('Failed to delete income.');
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
        <Spinner label="Loading income…" />
      ) : incomes.length === 0 ? (
        <p className="empty-state">No income recorded yet.</p>
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

      {error && <p className="error-text">{error}</p>}
    </Card>
  );
}