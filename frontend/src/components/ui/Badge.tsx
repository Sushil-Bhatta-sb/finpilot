import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'brand';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({
  children,
  variant = 'neutral',
  className = '',
}: BadgeProps) {
  return (
    <span className={`ui-badge ui-badge-${variant} ${className}`.trim()}>
      {children}
    </span>
  );
}
