import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import IncomeList from './components/incomeList';
import ExpenseList from './components/expenseList';
import Button from './components/ui/Button';
import './App.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const balance = incomeTotal - expenseTotal;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark">F</span>
            FinPilot
          </div>
          <div className="topbar-user">
            <span>Welcome, {user?.name}</span>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="summary-grid">
          <div className="stat-card">
            <div className="stat-label">Total Income</div>
            <div className="stat-value income">Rs. {incomeTotal}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value expense">Rs. {expenseTotal}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Balance</div>
            <div className="stat-value">Rs. {balance}</div>
          </div>
        </div>

        <div className="panels">
          <IncomeList onTotalChange={setIncomeTotal} />
          <ExpenseList onTotalChange={setExpenseTotal} />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;