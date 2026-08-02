interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  className = '',
}: SkeletonProps) {
  return (
    <span
      className={`ui-skeleton ${className}`.trim()}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

export function SkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <div className="ui-skeleton-list">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="ui-skeleton-row" key={i}>
          <Skeleton width="40%" height={14} />
          <Skeleton width="20%" height={14} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="ui-skeleton-cards">
      {Array.from({ length: count }).map((_, i) => (
        <div className="ui-skeleton-card" key={i}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="90%" height={26} />
          <Skeleton width="100%" height={10} />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
