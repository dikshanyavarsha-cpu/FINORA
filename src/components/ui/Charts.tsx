interface DonutChartProps {
  data: { label: string; value: number; percentage: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, size = 180, thickness = 28, centerLabel, centerValue }: DonutChartProps) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          className="stroke-slate-100 dark:stroke-slate-700/40"
        />
        {data.map((item, i) => {
          const dash = (item.percentage / 100) * circumference;
          const segment = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={thickness}
              stroke={item.color}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          );
          offset += dash;
          return segment;
        })}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="font-display font-bold text-xl text-slate-900 dark:text-white">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{centerLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  formatValue?: (v: number) => string;
}

export function BarChart({ data, height = 160, formatValue }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((item, i) => {
        const barHeight = (item.value / max) * (height - 30);
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5">
            {formatValue && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {formatValue(item.value)}
              </span>
            )}
            <div
              className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
              style={{
                height: barHeight,
                backgroundColor: item.color || '#1a76f0',
              }}
            />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full text-center">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number; invested?: number }[];
  height?: number;
  showInvested?: boolean;
  formatValue?: (v: number) => string;
}

export function LineChart({ data, height = 180, showInvested = false, formatValue }: LineChartProps) {
  if (data.length === 0) return null;
  const width = 100;
  const maxVal = Math.max(...data.map((d) => Math.max(d.value, d.invested || 0)), 1);
  const minVal = Math.min(...data.map((d) => Math.min(d.value, d.invested || d.value)), 0);
  const range = maxVal - minVal || 1;
  const step = width / (data.length - 1 || 1);

  const points = data.map((d, i) => ({
    x: i * step,
    y: height - 20 - ((d.value - minVal) / range) * (height - 40),
  investedY: showInvested && d.invested !== undefined
      ? height - 20 - ((d.invested - minVal) / range) * (height - 40)
      : null,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${width} ${height - 20} L 0 ${height - 20} Z`;
  const investedPathD = showInvested && points.every((p) => p.investedY !== null)
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.investedY}`).join(' ')
    : '';

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a76f0" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1a76f0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGrad)" />
        <path d={pathD} fill="none" stroke="#1a76f0" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {investedPathD && (
          <path d={investedPathD} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        )}
      </svg>
      <div className="flex justify-between mt-1 px-1">
        {data.map((d, i) => (
          <span key={i} className="text-[9px] text-slate-400 dark:text-slate-500">
            {i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2) ? d.label : ''}
          </span>
        ))}
      </div>
      {formatValue && (
        <div className="flex justify-between mt-0.5 px-1">
          <span className="text-[9px] text-slate-400">{formatValue(minVal)}</span>
          <span className="text-[9px] text-slate-400">{formatValue(maxVal)}</span>
        </div>
      )}
    </div>
  );
}

interface ProgressRingProps {
  progress: number;
  size?: number;
  thickness?: number;
  color?: string;
  label?: string;
}

export function ProgressRing({ progress, size = 80, thickness = 8, color = '#10b981', label }: ProgressRingProps) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          className="stroke-slate-100 dark:stroke-slate-700/40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          stroke={color}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-sm text-slate-900 dark:text-white">{Math.round(progress)}%</span>
        {label && <span className="text-[9px] text-slate-400">{label}</span>}
      </div>
    </div>
  );
}
