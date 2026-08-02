interface ProgressRingProps {
  percent: number;
  size?: number;
  stroke?: number;
  label?: string;
}

/** Colour shifts green -> amber -> red as usage climbs toward/over 100%. */
function ringColor(percent: number): string {
  if (percent >= 100) return 'var(--danger)';
  if (percent >= 80) return 'var(--warning)';
  return 'var(--success)';
}

export default function ProgressRing({
  percent,
  size = 92,
  stroke = 9,
  label,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(percent, 100));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color = ringColor(percent);

  return (
    <div className="ui-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
        />
      </svg>
      <span className="ui-ring-label" style={{ color }}>
        {label ?? `${Math.round(percent)}%`}
      </span>
    </div>
  );
}
