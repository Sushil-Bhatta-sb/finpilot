import { useCallback, useEffect, useState } from 'react';
import type { Transaction } from '../types';
import { getTransactions } from '../api/transaction';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import { IncomeExpenseBar, SpendingLine, CategoryPie } from '../components/Charts';

export default function Analytics() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTransactions({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sortBy: 'date',
        order: 'asc',
      });
      setTransactions(res.data);
    } catch {
      setError('Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    load();
  }, [load]);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + (t.amount || 0), 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + (t.amount || 0), 0);

  // Monthly spending (expenses grouped by YYYY-MM).
  const byMonth = new Map<string, number>();
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const label = new Date(t.date).toISOString().slice(0, 7);
      byMonth.set(label, (byMonth.get(label) || 0) + (t.amount || 0));
    });
  const spendingLine = Array.from(byMonth.entries())
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Spending by transaction type (pie).
  const byType = new Map<string, number>();
  transactions.forEach((t) => {
    byType.set(t.type, (byType.get(t.type) || 0) + (t.amount || 0));
  });
  const typeData = Array.from(byType.entries()).map(([name, value]) => ({ name, value }));

  return (
    <div className="stack">
      <div className="page-head">
        <h1>Analytics</h1>
      </div>

      <Card>
        <div className="filters-row">
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
          <Button
            variant="secondary"
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
          >
            Clear
          </Button>
        </div>
        {error && <p className="error-text">{error}</p>}
      </Card>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid-2">
          <div className="chart-card">
            <h3>Income vs Expense</h3>
            <IncomeExpenseBar income={totalIncome} expense={totalExpense} />
          </div>
          <div className="chart-card">
            <h3>Monthly Spending</h3>
            {spendingLine.length ? (
              <SpendingLine data={spendingLine} />
            ) : (
              <p className="empty-state">No spending in range.</p>
            )}
          </div>
          <div className="chart-card">
            <h3>Spending by Type</h3>
            <CategoryPie data={typeData} />
          </div>
        </div>
      )}
    </div>
  );
}
