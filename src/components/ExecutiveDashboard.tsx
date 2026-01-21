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

// Get status label and color
function getStatusInfo(status: RAGStatus): { label: string; color: string; bgColor: string } {
  switch (status) {
    case 'on-track':
      return { label: 'On Track', color: 'var(--status-green)', bgColor: 'rgba(34, 197, 94, 0.1)' };
    case 'progressing':
      return { label: 'Progressing', color: 'var(--status-yellow)', bgColor: 'rgba(234, 179, 8, 0.1)' };
    case 'off-track':
      return { label: 'Off Track', color: 'var(--status-red)', bgColor: 'rgba(239, 68, 68, 0.1)' };
    default:
      return { label: 'No Status', color: 'var(--status-gray)', bgColor: 'rgba(156, 163, 175, 0.1)' };
  }
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

  const handleCardClick = () => {
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

      {/* OKR Cards */}
      <div className="exec-okr-list">
        {globalOKRs.map(okr => {
          const status = getOKRStatus(okr);
          const statusInfo = getStatusInfo(status);
          const progress = calculateOKRProgress(okr);

          return (
            <div
              key={okr.id}
              className="exec-okr-card"
              onClick={handleCardClick}
              style={{ cursor: 'pointer' }}
            >
              <div className="exec-okr-header">
                <span
                  className="exec-status-dot"
                  style={{ backgroundColor: statusInfo.color }}
                  title={statusInfo.label}
                />
                <span className="exec-okr-id">{okr.displayId}:</span>
                <span className="exec-okr-title">{okr.objective}</span>
              </div>

              <div className="exec-progress-container">
                <div className="exec-progress-track">
                  <div
                    className="exec-progress-fill"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: statusInfo.color,
                    }}
                  />
                </div>
                <span className="exec-progress-value">{progress}%</span>
              </div>

              <div className="exec-okr-meta">
                <span className="exec-okr-owner">
                  {okr.owner || 'No owner'}
                </span>
                <span className="exec-okr-separator">•</span>
                <span className="exec-okr-krs">
                  {okr.keyResults.length} Key Result{okr.keyResults.length !== 1 ? 's' : ''}
                </span>
              </div>
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
