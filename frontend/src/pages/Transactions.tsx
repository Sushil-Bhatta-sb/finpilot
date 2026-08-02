import { useCallback, useEffect, useState } from 'react';
import { Receipt } from 'lucide-react';
import type { Transaction, TransactionType } from '../types';
import {
  getTransactions,
  exportCSV,
  exportPDF,
  type TransactionFilters,
} from '../api/transaction';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

const TYPES: TransactionType[] = ['income', 'expense', 'budget', 'investment', 'savings'];

export default function Transactions() {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const filters: TransactionFilters = { sortBy, order };
      if (search) filters.search = search;
      if (type) filters.type = type;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      const res = await getTransactions(filters);
      setTransactions(res.data);
    } catch {
      showToast('Failed to load transactions.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, type, startDate, endDate, sortBy, order, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setOrder('desc');
    }
  };

  const download = async (
    fetcher: () => Promise<{ data: Blob }>,
    filename: string
  ) => {
    try {
      const res = await fetcher();
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
      showToast('Export downloaded', 'success');
    } catch {
      showToast('Export failed.', 'error');
    }
  };

  const sortIndicator = (field: string) =>
    sortBy === field ? (order === 'asc' ? ' ▲' : ' ▼') : '';

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Transactions</h1>
        <div className="row-actions">
          <Button variant="secondary" onClick={() => download(exportCSV, 'transactions.csv')}>
            Export CSV
          </Button>
          <Button variant="secondary" onClick={() => download(exportPDF, 'transactions.pdf')}>
            Export PDF
          </Button>
        </div>
      </div>

      <Card>
        <div className="filters-row">
          <Input
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Description…"
          />
          <div className="field">
            <label className="field-label">Type</label>
            <select className="field-input" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="From"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="To"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {loading ? (
          <SkeletonList rows={6} />
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={<Receipt size={30} />}
            title="No transactions found"
            message="Try adjusting your filters or add some income and expenses."
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort('date')}>Date{sortIndicator('date')}</th>
                  <th onClick={() => toggleSort('type')}>Type{sortIndicator('type')}</th>
                  <th>Description</th>
                  <th onClick={() => toggleSort('amount')}>Amount{sortIndicator('amount')}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id}>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td>
                      <Badge
                        variant={
                          t.type === 'income'
                            ? 'success'
                            : t.type === 'expense'
                              ? 'danger'
                              : 'brand'
                        }
                      >
                        {t.type}
                      </Badge>
                    </td>
                    <td>{t.description || '—'}</td>
                    <td>{t.amount != null ? `Rs. ${t.amount}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
