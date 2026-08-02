import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  message,
  action,
}: EmptyStateProps) {
  return (
    <div className="ui-empty">
      {icon && <div className="ui-empty-icon">{icon}</div>}
      <p className="ui-empty-title">{title}</p>
      {message && <p className="ui-empty-msg">{message}</p>}
      {action && <div className="ui-empty-action">{action}</div>}
    </div>
  );
}
