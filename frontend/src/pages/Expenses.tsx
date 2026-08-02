import ExpenseList from '../components/expenseList';

export default function Expenses() {
  return (
    <div className="stack">
      <div className="page-head">
        <h1>Expenses</h1>
      </div>
      <ExpenseList />
    </div>
  );
}
