import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="auth-wrap">
      <div className="auth-card card">
        <div className="auth-head">
          <h1>404</h1>
          <p>The page you're looking for doesn't exist.</p>
        </div>
        <Link to="/">Go back to Dashboard</Link>
      </div>
    </div>
  );
}
