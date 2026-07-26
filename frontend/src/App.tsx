import IncomeList from './components/incomeList';
import ExpenseList from './components/expenseList';
import './App.css';

function App() {
  return (
    <div className="container">
      <h1>FinPilot</h1>
      <IncomeList />
      <ExpenseList />
    </div>
  );
}

export default App;