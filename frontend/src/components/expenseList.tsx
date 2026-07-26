import { useEffect, useState } from 'react';
import type { Expense } from '../types';
import { getExpenses, createExpense, deleteExpense } from '../api/expense';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const load = async () => {
    const res = await getExpenses();
    setExpenses(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    await createExpense({ title, amount: Number(amount) });
    setTitle('');
    setAmount('');
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
    load();
  };

  return (
    <div>
      <h2>Expenses</h2>
      <form onSubmit={handleAdd}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g. Groceries)" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" />
        <button type="submit">Add Expense</button>
      </form>
      <ul>
        {expenses.map((ex) => (
          <li key={ex._id}>
            {ex.title} — Rs. {ex.amount}
            <button onClick={() => handleDelete(ex._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}