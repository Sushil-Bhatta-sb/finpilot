import { useState } from 'react';
import { createIncome } from '../api/income';
import { createExpense } from '../api/expense';
import { useToast } from '../context/ToastContext';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';

interface QuickAddProps {
  open: boolean;
  onClose: () => void;
  onAdded?: () => void;
}

type Kind = 'expense' | 'income';

export default function QuickAdd({ open, onClose, onAdded }: QuickAddProps) {
  const { showToast } = useToast();
  const [kind, setKind] = useState<Kind>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setTitle('');
    setAmount('');
    setCategory('');
    setDate('');
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    setSaving(true);
    try {
      const payload = {
        title,
        amount: Number(amount),
        category: category || 'General',
        date: date || undefined,
      };
      if (kind === 'income') await createIncome(payload);
      else await createExpense(payload);
      showToast(`${kind === 'income' ? 'Income' : 'Expense'} added`, 'success');
      reset();
      onAdded?.();
      onClose();
    } catch {
      showToast(`Failed to add ${kind}.`, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title="Quick Add">
      <div className="quickadd-toggle">
        <button
          type="button"
          className={`quickadd-tab${kind === 'expense' ? ' active expense' : ''}`}
          onClick={() => setKind('expense')}
        >
          Expense
        </button>
        <button
          type="button"
          className={`quickadd-tab${kind === 'income' ? ' active income' : ''}`}
          onClick={() => setKind('income')}
        >
          Income
        </button>
      </div>

      <form className="stack" onSubmit={submit}>
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={kind === 'income' ? 'e.g. Salary' : 'e.g. Groceries'}
          autoFocus
        />
        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1000"
        />
        <Input
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Food"
        />
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button type="submit" loading={saving} fullWidth>
          Add {kind === 'income' ? 'Income' : 'Expense'}
        </Button>
      </form>
    </Modal>
  );
}
