import { useEffect, useState } from 'react';
import type { Expense } from '../types';
import { getExpenses, createExpense, deleteExpense } from '../api/expense';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Spinner from './ui/Spinner';

interface Props {
  onTotalChange?: (total: number) => void;
}

export default function ExpenseList({ onTotalChange }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getExpenses();
      setExpenses(res.data);
      onTotalChange?.(res.data.reduce((sum, ex) => sum + ex.amount, 0));
    } catch {
      setError('Failed to load expenses.');
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
      await createExpense({ title, amount: Number(amount) });
      setTitle('');
      setAmount('');
      await load();
    } catch {
      setError('Failed to add expense.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id);
      await load();
    } catch {
      setError('Failed to delete expense.');
    }
  };

  return (
    <Card>
      <div className="card-header">
        <span className="card-title">Expenses</span>
      </div>

      <form className="inline-form" onSubmit={handleAdd}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (e.g. Groceries)"
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
        <Spinner label="Loading expenses…" />
      ) : expenses.length === 0 ? (
        <p className="empty-state">No expenses recorded yet.</p>
      ) : (
        <ul className="txn-list">
          {expenses.map((ex) => (
            <li className="txn-item" key={ex._id}>
              <div className="txn-main">
                <span className="txn-title">{ex.title}</span>
                {ex.category && <span className="txn-meta">{ex.category}</span>}
              </div>
              <div className="txn-right">
                <span className="txn-amount expense">Rs. {ex.amount}</span>
                <Button variant="danger" onClick={() => handleDelete(ex._id)}>
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