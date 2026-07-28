import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import IncomeList from './components/incomeList';
import ExpenseList from './components/expenseList';
import './App.css';

function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="container">
      <h1>FinPilot</h1>
      <p>
        Welcome, {user?.name}
        <button onClick={logout}>Logout</button>
      </p>
      <IncomeList />
      <ExpenseList />
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