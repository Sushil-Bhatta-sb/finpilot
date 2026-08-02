import { useEffect, useState } from 'react';
import { Plus, PiggyBank } from 'lucide-react';
import type { SavingsGoal } from '../types';
import { getGoals, createGoal, deleteGoal, depositToGoal } from '../api/savings';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ProgressRing from '../components/ui/ProgressRing';
import { SkeletonCards } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

export default function Savings() {
  const { showToast } = useToast();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const [depositId, setDepositId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getGoals();
      setGoals(res.data);
    } catch {
      showToast('Failed to load savings goals.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setTitle('');
    setTargetAmount('');
    setTargetDate('');
    setCreateOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount) return;
    setSaving(true);
    try {
      await createGoal({
        title,
        targetAmount: Number(targetAmount),
        targetDate: targetDate || undefined,
      });
      showToast('Goal created', 'success');
      setCreateOpen(false);
      await load();
    } catch {
      showToast('Failed to create goal.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGoal(id);
      showToast('Goal deleted', 'success');
      await load();
    } catch {
      showToast('Failed to delete goal.', 'error');
    }
  };

  const openDeposit = (id: string) => {
    setDepositId(id);
    setDepositAmount('');
  };

  const submitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositId || !depositAmount) return;
    setSaving(true);
    try {
      await depositToGoal(depositId, Number(depositAmount));
      showToast('Deposit added', 'success');
      setDepositId(null);
      setDepositAmount('');
      await load();
    } catch {
      showToast('Failed to deposit.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Savings Goals</h1>
        <Button onClick={openCreate}>
          <span className="btn-icon-label">
            <Plus size={16} /> Add Goal
          </span>
        </Button>
      </div>

      {loading ? (
        <SkeletonCards count={3} />
      ) : goals.length === 0 ? (
        <EmptyState
          icon={<PiggyBank size={30} />}
          title="No savings goals yet"
          message="Create a goal and watch your progress grow."
          action={<Button onClick={openCreate}>Add your first goal</Button>}
        />
      ) : (
        <div className="grid-3">
          {goals.map((g) => {
            const percent = g.targetAmount
              ? Math.round((g.savedAmount / g.targetAmount) * 100)
              : 0;
            return (
              <Card key={g._id} className="goal-card">
                <div className="goal-head">
                  <div>
                    <strong>{g.title}</strong>
                    {g.completed && (
                      <Badge variant="success" className="ml-8">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="goal-body">
                  <ProgressRing percent={percent} />
                  <div className="goal-figures">
                    <span className="goal-saved">Rs. {g.savedAmount}</span>
                    <span className="muted">of Rs. {g.targetAmount}</span>
                    {g.targetDate && (
                      <span className="muted goal-date">
                        by {new Date(g.targetDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="goal-actions">
                  {!g.completed && (
                    <Button variant="secondary" onClick={() => openDeposit(g._id)}>
                      Deposit
                    </Button>
                  )}
                  <Button variant="danger" onClick={() => handleDelete(g._id)}>
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Goal">
        <form className="stack" onSubmit={handleCreate}>
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Emergency Fund"
            autoFocus
          />
          <Input
            label="Target Amount"
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="50000"
          />
          <Input
            label="Target Date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
          <Button type="submit" loading={saving} fullWidth>
            Add Goal
          </Button>
        </form>
      </Modal>

      <Modal
        open={depositId !== null}
        onClose={() => setDepositId(null)}
        title="Deposit to Goal"
      >
        <form className="stack" onSubmit={submitDeposit}>
          <Input
            label="Deposit amount"
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="1000"
            autoFocus
          />
          <Button type="submit" loading={saving} fullWidth>
            Save Deposit
          </Button>
        </form>
      </Modal>
    </div>
  );
}
