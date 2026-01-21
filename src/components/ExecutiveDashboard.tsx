import { OKR, KeyResult } from '../types';

type View = 'home' | 'management' | 'tree' | 'dashboards' | 'users';
type RAGStatus = 'on-track' | 'progressing' | 'off-track' | 'no-status';

interface ExecutiveDashboardProps {
  okrs: OKR[];
  onNavigate: (view: View) => void;
}

// Calculate progress for a single Key Result
function calculateKRProgress(kr: KeyResult): number {
  if (kr.current === undefined) return 0;
  const range = kr.to - kr.from;
  if (range === 0) return 100;
  const progress = ((kr.current - kr.from) / range) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
}

// Calculate overall progress for an OKR (average of all KRs)
function calculateOKRProgress(okr: OKR): number {
  if (okr.keyResults.length === 0) return 0;
  const total = okr.keyResults.reduce((sum, kr) => sum + calculateKRProgress(kr), 0);
  return Math.round(total / okr.keyResults.length);
}

// Determine RAG status for an OKR based on its Key Results
function getOKRStatus(okr: OKR): RAGStatus {
  const statuses = okr.keyResults.map(kr => kr.status).filter(Boolean);

  if (statuses.length === 0) return 'no-status';

  const hasOffTrack = statuses.some(s => s === 'off-track');
  if (hasOffTrack) return 'off-track';

  const onTrackCount = statuses.filter(s => s === 'on-track').length;
  const progressingCount = statuses.filter(s => s === 'progressing').length;

  if (onTrackCount > progressingCount) return 'on-track';
  if (progressingCount >= onTrackCount) return 'progressing';

  return 'progressing';
}

// Get color for RAG status
function getStatusColor(status: RAGStatus): string {
  switch (status) {
    case 'on-track': return '#22c55e';      // green
    case 'progressing': return '#eab308';   // yellow/amber
    case 'off-track': return '#ef4444';     // red
    default: return '#6b7280';              // gray
  }
}

// Circular Progress Component
interface CircularProgressProps {
  progress: number;
  color: string;
  label: string;
  size?: number;
}

function CircularProgress({ progress, color, label, size = 140 }: CircularProgressProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  return (
    <svg width={size} height={size} className="circular-progress">
      {/* Background ring */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="#1f2937"
        stroke="#374151"
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      {/* Center text */}
      <text
        x={center}
        y={center - 10}
        textAnchor="middle"
        fill="white"
        fontSize="16"
        fontWeight="600"
      >
        {label}
      </text>
      <text
        x={center}
        y={center + 16}
        textAnchor="middle"
        fill="white"
        fontSize="22"
        fontWeight="700"
      >
        {progress}%
      </text>
    </svg>
  );
}

export function ExecutiveDashboard({ okrs, onNavigate }: ExecutiveDashboardProps) {
  // Filter to only Global OKRs (those with displayId, no parentId)
  const globalOKRs = okrs.filter(okr => okr.displayId && !okr.parentId);

  // Calculate status counts
  const statusCounts = globalOKRs.reduce(
    (counts, okr) => {
      const status = getOKRStatus(okr);
      counts[status]++;
      return counts;
    },
    { 'on-track': 0, 'progressing': 0, 'off-track': 0, 'no-status': 0 }
  );

  const handleChartClick = () => {
    onNavigate('tree');
  };

  return (
    <div className="exec-dashboard">
      <header className="exec-dashboard-header">
        <h1>Executive Dashboard</h1>
        <p className="exec-dashboard-subtitle">OKR Performance Overview</p>
      </header>

      {/* Summary Stats */}
      <div className="exec-summary-stats">
        <div className="exec-stat-card exec-stat-green">
          <div className="exec-stat-count">{statusCounts['on-track']}</div>
          <div className="exec-stat-label">On Track</div>
        </div>
        <div className="exec-stat-card exec-stat-yellow">
          <div className="exec-stat-count">{statusCounts['progressing']}</div>
          <div className="exec-stat-label">Progressing</div>
        </div>
        <div className="exec-stat-card exec-stat-red">
          <div className="exec-stat-count">{statusCounts['off-track']}</div>
          <div className="exec-stat-label">Off Track</div>
        </div>
      </div>

      {/* Circular Progress Charts */}
      <div className="exec-charts-grid">
        {globalOKRs.map(okr => {
          const status = getOKRStatus(okr);
          const color = getStatusColor(status);
          const progress = calculateOKRProgress(okr);

          return (
            <div
              key={okr.id}
              className="exec-chart-item"
              onClick={handleChartClick}
            >
              <CircularProgress
                progress={progress}
                color={color}
                label={okr.displayId || ''}
              />
              <p className="exec-chart-objective">{okr.objective}</p>
              <p className="exec-chart-owner">{okr.owner || 'No owner'}</p>
            </div>
          );
        })}
      </div>

      {globalOKRs.length === 0 && (
        <div className="exec-empty-state">
          <p>No Global OKRs found. Create OKRs in the OKR List to see them here.</p>
        </div>
      )}
    </div>
  );
}
