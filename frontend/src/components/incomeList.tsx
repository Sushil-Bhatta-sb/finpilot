import { useEffect, useState } from 'react';
import type { Income } from '../types';
import { getIncomes, createIncome, deleteIncome } from '../api/income';

export default function IncomeList() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const load = async () => {
    const res = await getIncomes();
    setIncomes(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    await createIncome({ title, amount: Number(amount) });
    setTitle('');
    setAmount('');
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteIncome(id);
    load();
  };

  return (
    <div>
      <h2>Income</h2>
      <form onSubmit={handleAdd}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g. Salary)" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" />
        <button type="submit">Add Income</button>
      </form>
      <ul>
        {incomes.map((i) => (
          <li key={i._id}>
            {i.title} — Rs. {i.amount}
            <button onClick={() => handleDelete(i._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}