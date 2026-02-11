import { OKR, OKRStatus, KeyResult, KeyResultStatus, Action } from '../types';

type View = 'home' | 'management' | 'tree' | 'dashboards' | 'users';

interface ExecutiveDashboardProps {
  okrs: OKR[];
  onNavigate: (view: View) => void;
  onOkrClick?: (okrId: string) => void;
  onActionClick?: (globalOkrId: string, areaOkrId: string) => void;
}

// ─── Progress calculations ──────────────────────────────────────
function calculateKRProgress(kr: KeyResult): number {
  if (kr.current === undefined) return 0;
  const range = kr.to - kr.from;
  if (range === 0) return 100;
  const progress = ((kr.current - kr.from) / range) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
}

function calculateOKRProgress(okr: OKR): number {
  if (okr.keyResults.length === 0) return 0;
  const total = okr.keyResults.reduce((sum, kr) => sum + calculateKRProgress(kr), 0);
  return Math.round(total / okr.keyResults.length);
}

function getStatusColor(status: OKRStatus): string {
  switch (status) {
    case 'on-track': return 'var(--status-green)';
    case 'progressing': return 'var(--status-yellow)';
    case 'off-track': return 'var(--status-red)';
    default: return 'var(--status-gray)';
  }
}


// ─── Summary bucket (3-way grouping) ────────────────────────────
function getSummaryBucket(status: OKRStatus): 'on-track' | 'progressing' | 'off-track' {
  switch (status) {
    case 'on-track': return 'on-track';
    case 'progressing': return 'progressing';
    default: return 'off-track';
  }
}

// ─── Action counts per Area OKR ─────────────────────────────────
function getAreaActionCounts(actions: Action[]): { overdue: number; completed: number; open: number } {
  if (!actions || actions.length === 0) return { overdue: 0, completed: 0, open: 0 };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdue = actions.filter(a => !a.completed && new Date(a.dueDate) < today).length;
  const completed = actions.filter(a => a.completed).length;
  const open = actions.filter(a => !a.completed && new Date(a.dueDate) >= today).length;
  return { overdue, completed, open };
}

// ─── KR color mapping ───────────────────────────────────────────
function getKRColor(status?: KeyResultStatus): string {
  switch (status) {
    case 'on-track': return 'var(--status-green)';
    case 'progressing': return 'var(--status-yellow)';
    case 'off-track': return 'var(--status-red)';
    default: return 'var(--status-gray)';
  }
}

// ─── Circular Progress ──────────────────────────────────────────
interface CircularProgressProps {
  actualProgress: number;
  color: string;
  size?: number;
  label?: string;
}

function CircularProgress({ actualProgress, color, size = 80, label }: CircularProgressProps) {
  const isLarge = size >= 80;
  const strokeWidth = isLarge ? 8 : 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const actualOffset = circumference - (actualProgress / 100) * circumference;
  const center = size / 2;

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--progress-track)" strokeWidth={strokeWidth} />
      <circle
        cx={center} cy={center} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={actualOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      {isLarge && label ? (
        <>
          <text x={center} y={center - 6} textAnchor="middle" fill="var(--notion-text)" fontSize="14" fontWeight="700">
            {label}
          </text>
          <text x={center} y={center + 14} textAnchor="middle" fill="var(--notion-text-light)" fontSize="13" fontWeight="600">
            {actualProgress}%
          </text>
        </>
      ) : (
        <text
          x={center}
          y={center + (isLarge ? 5 : 4)}
          textAnchor="middle"
          fill="var(--notion-text)"
          fontSize={isLarge ? '16' : '10'}
          fontWeight="700"
        >
          {actualProgress}%
        </text>
      )}
    </svg>
  );
}


// ─── Summary Card ───────────────────────────────────────────────
function SummaryCard({ count, label, bgColor, textColor, accentColor }: {
  count: number;
  label: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
}) {
  return (
    <div className="exec-summary-card" style={{ background: bgColor }}>
      <div className="exec-summary-card__count" style={{ color: accentColor }}>{count}</div>
      <div className="exec-summary-card__label" style={{ color: textColor }}>{label}</div>
    </div>
  );
}

// ─── Compact KR Bar ─────────────────────────────────────────────
function CompactKRBar({ label, progress, color, title }: {
  label: string;
  progress: number;
  color: string;
  title?: string;
}) {
  return (
    <div className="exec-kr-compact" title={title}>
      <span className="exec-kr-compact__label"><span className="tree-card-kr-icon">◉</span> {label}</span>
      <div className="exec-kr-compact__bar">
        <div className="exec-kr-compact__bar-fill" style={{ width: `${progress}%`, background: color }} />
      </div>
      <span className="exec-kr-compact__pct">{progress}%</span>
    </div>
  );
}

// ─── Action Badge with Tooltip ──────────────────────────────────
function ActionBadgeWithTooltip({ count, label, variant, actions, onClick }: {
  count: number;
  label: string;
  variant: 'overdue' | 'completed' | 'open';
  actions: Action[];
  onClick?: () => void;
}) {
  return (
    <div className="exec-action-tooltip-container">
      <span
        className={`exec-action-badge exec-action-badge--${variant} ${onClick ? 'exec-action-badge--clickable' : ''}`}
        onClick={(e) => { if (onClick) { e.stopPropagation(); onClick(); } }}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        {count} {label}
      </span>
      <div className="exec-action-tooltip">
        <div className="exec-action-tooltip__title">{label} Actions</div>
        {actions.map((action, i) => (
          <div key={action.id || i} className="exec-action-tooltip__item">
            <div className="exec-action-tooltip__text">{action.text}</div>
            <div className="exec-action-tooltip__meta">
              {action.owner} · {new Date(action.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Area OKR Row ───────────────────────────────────────────────
function AreaOKRRow({ areaOkr, index, onActionClick }: { areaOkr: OKR; index: number; onActionClick?: () => void }) {
  const progress = calculateOKRProgress(areaOkr);
  const status: OKRStatus = areaOkr.status || 'off-track';
  const color = getStatusColor(status);
  const actions = areaOkr.actions || [];
  const counts = getAreaActionCounts(actions);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueActions = actions.filter(a => !a.completed && new Date(a.dueDate) < today);
  const completedActions = actions.filter(a => a.completed);
  const openActions = actions.filter(a => !a.completed && new Date(a.dueDate) >= today);

  return (
    <div className="exec-area-row">
      <div className="exec-area-row__name" title={areaOkr.objective}><span className="tree-card-icon tree-card-icon-child">◎</span> {areaOkr.area || `Area OKR-${index + 1}`}</div>
      <div className="exec-area-row__progress">
        <CircularProgress actualProgress={progress} color={color} size={36} />
      </div>
      <div className="exec-area-row__actions">
        {actions.length === 0 ? (
          null
        ) : (
          <>
            <span className="exec-actions-label">Actions</span>
            {counts.overdue > 0 && (
              <ActionBadgeWithTooltip count={counts.overdue} label="Overdue" variant="overdue" actions={overdueActions} onClick={onActionClick} />
            )}
            {counts.completed > 0 && (
              <ActionBadgeWithTooltip count={counts.completed} label="Completed" variant="completed" actions={completedActions} onClick={onActionClick} />
            )}
            {counts.open > 0 && (
              <ActionBadgeWithTooltip count={counts.open} label="Open" variant="open" actions={openActions} onClick={onActionClick} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── OKR Card ───────────────────────────────────────────────────
function OKRCard({ globalOkr, children, onClick, onActionClick }: { globalOkr: OKR; children: OKR[]; onClick?: () => void; onActionClick?: (globalOkrId: string, areaOkrId: string) => void }) {
  const progress = calculateOKRProgress(globalOkr);
  const status: OKRStatus = globalOkr.status || 'off-track';
  const color = getStatusColor(status);

  return (
    <div className="exec-okr-card-wrapper">
      <div className="exec-okr-card">
      <h3 className="exec-okr-card__title" title={globalOkr.objective} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <span className="tree-card-icon tree-card-icon-parent">◎</span> {globalOkr.displayId}: <span className="exec-okr-card__objective">{globalOkr.objective}</span>
      </h3>
      {/* Section A: OKR Overview */}
      <div className="exec-okr-card__overview">
        <div title={globalOkr.objective} style={{ cursor: 'default' }}>
          <CircularProgress actualProgress={progress} color={color} size={120} />
        </div>
        <div className="exec-kr-list">
          {globalOkr.keyResults.length === 0 ? (
            <span className="exec-no-actions">No key results</span>
          ) : (
            globalOkr.keyResults.map((kr, index) => (
              <CompactKRBar
                key={kr.id}
                label={`KR-${index + 1}`}
                progress={calculateKRProgress(kr)}
                color={getKRColor(kr.status)}
                title={kr.metricName}
              />
            ))
          )}
        </div>
      </div>

      {/* Vertical divider */}
      <div className="exec-okr-card__divider" />

      {/* Section B: Area OKR Breakdown */}
      <div className="exec-okr-card__breakdown">
        {children.length === 0 ? (
          <div className="exec-no-actions">No area OKRs</div>
        ) : (
          <div className="exec-area-table">
            {children.map((child, index) => (
              <AreaOKRRow key={child.id} areaOkr={child} index={index} onActionClick={onActionClick ? () => onActionClick(globalOkr.id, child.id) : undefined} />
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────
export function ExecutiveDashboard({ okrs, onOkrClick, onActionClick }: ExecutiveDashboardProps) {
  const globalOKRs = okrs.filter(okr => okr.displayId && !okr.parentId);

  const summaryCounts = { 'on-track': 0, progressing: 0, 'off-track': 0 };
  globalOKRs.forEach(okr => {
    const bucket = getSummaryBucket(okr.status || 'off-track');
    summaryCounts[bucket]++;
  });

  return (
    <div className="exec-dashboard">
      <header className="exec-dashboard-header">
        <h1>Dashboard</h1>
      </header>

      <div className="exec-summary-row">
        <SummaryCard
          count={summaryCounts['on-track']}
          label="ON TRACK"
          bgColor="var(--status-green-bg)"
          textColor="var(--status-green-text)"
          accentColor="var(--status-green)"
        />
        <SummaryCard
          count={summaryCounts.progressing}
          label="PROGRESSING"
          bgColor="var(--status-yellow-bg)"
          textColor="var(--status-yellow-text)"
          accentColor="var(--status-yellow)"
        />
        <SummaryCard
          count={summaryCounts['off-track']}
          label="OFF TRACK"
          bgColor="var(--status-red-bg)"
          textColor="var(--status-red-text)"
          accentColor="var(--status-red)"
        />
      </div>

      <div className="exec-okr-list">
        {globalOKRs.map(okr => {
          const children = okrs.filter(o => o.parentId === okr.id);
          return <OKRCard key={okr.id} globalOkr={okr} children={children} onClick={onOkrClick ? () => onOkrClick(okr.id) : undefined} onActionClick={onActionClick} />;
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
