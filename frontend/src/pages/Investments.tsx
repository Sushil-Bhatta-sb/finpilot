import { useEffect, useState } from 'react';
import { Plus, LineChart } from 'lucide-react';
import type { Investment, InvestmentType } from '../types';
import {
  getInvestments,
  createInvestment,
  deleteInvestment,
} from '../api/investment';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

const TYPES: InvestmentType[] = [
  'Stocks',
  'Mutual Funds',
  'Crypto',
  'Gold',
  'Fixed Deposit',
  'Real Estate',
];

export default function Investments() {
  const { showToast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<InvestmentType>('Stocks');
  const [amountInvested, setAmountInvested] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getInvestments();
      setInvestments(res.data);
    } catch {
      showToast('Failed to load investments.', 'error');
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
    setType('Stocks');
    setAmountInvested('');
    setCurrentValue('');
    setModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amountInvested || !currentValue) return;
    setSaving(true);
    try {
      await createInvestment({
        name,
        type,
        amountInvested: Number(amountInvested),
        currentValue: Number(currentValue),
      });
      showToast('Investment added', 'success');
      setModalOpen(false);
      await load();
    } catch {
      showToast('Failed to add investment.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInvestment(id);
      showToast('Investment deleted', 'success');
      await load();
    } catch {
      showToast('Failed to delete investment.', 'error');
    }
  };

  const portfolioValue = investments.reduce((s, i) => s + i.currentValue, 0);
  const totalProfit = investments.reduce((s, i) => s + Math.max(i.profitLoss, 0), 0);
  const totalLoss = investments.reduce((s, i) => s + Math.min(i.profitLoss, 0), 0);

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Investments</h1>
        <Button onClick={openCreate}>
          <span className="btn-icon-label">
            <Plus size={16} /> Add Investment
          </span>
        </Button>
      </div>

      <div className="grid-3">
        <div className="stat-card">
          <div className="stat-label">Portfolio Value</div>
          <div className="stat-value">Rs. {portfolioValue}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Profit</div>
          <div className="stat-value income">Rs. {totalProfit}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Loss</div>
          <div className="stat-value expense">Rs. {Math.abs(totalLoss)}</div>
        </div>
      </div>

      <Card>
        <div className="card-header">
          <span className="card-title">Portfolio</span>
        </div>
        {loading ? (
          <SkeletonList rows={4} />
        ) : investments.length === 0 ? (
          <EmptyState
            icon={<LineChart size={30} />}
            title="No investments yet"
            message="Track your stocks, crypto, gold and more in one place."
            action={<Button onClick={openCreate}>Add your first investment</Button>}
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Invested</th>
                  <th>Current</th>
                  <th>Profit / Loss</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {investments.map((i) => (
                  <tr key={i._id}>
                    <td>{i.name}</td>
                    <td>
                      <Badge variant="brand">{i.type}</Badge>
                    </td>
                    <td>Rs. {i.amountInvested}</td>
                    <td>Rs. {i.currentValue}</td>
                    <td className={i.profitLoss >= 0 ? 'pl-positive' : 'pl-negative'}>
                      {i.profitLoss >= 0 ? '+' : '-'}Rs. {Math.abs(i.profitLoss)}
                    </td>
                    <td>
                      <Button variant="danger" onClick={() => handleDelete(i._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Investment">
        <form className="stack" onSubmit={handleCreate}>
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Apple Inc."
            autoFocus
          />
          <div className="field">
            <label className="field-label">Type</label>
            <select
              className="field-input"
              value={type}
              onChange={(e) => setType(e.target.value as InvestmentType)}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Amount Invested"
            type="number"
            value={amountInvested}
            onChange={(e) => setAmountInvested(e.target.value)}
            placeholder="10000"
          />
          <Input
            label="Current Value"
            type="number"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder="12000"
          />
          <Button type="submit" loading={saving} fullWidth>
            Add Investment
          </Button>
        </form>
      </Modal>
    </div>
  );
}
