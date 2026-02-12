import { useState, useEffect } from 'react';
import { OKR, OKRStatus, KeyResult, KeyResultStatus, Action } from '../types';

type View = 'management' | 'tree' | 'dashboards' | 'users';

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
  animate?: boolean;
}

function CircularProgress({ actualProgress, color, size = 80, label, animate }: CircularProgressProps) {
  const isLarge = size >= 80;
  const strokeWidth = isLarge ? 8 : 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const actualOffset = circumference - (actualProgress / 100) * circumference;
  const displayOffset = animate === false ? circumference : actualOffset;
  const center = size / 2;

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--progress-track)" strokeWidth={strokeWidth} />
      <circle
        cx={center} cy={center} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={displayOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
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


// ─── Compact KR Bar ─────────────────────────────────────────────
function CompactKRBar({ label, progress, color, title, animate, delay }: {
  label: string;
  progress: number;
  color: string;
  title?: string;
  animate?: boolean;
  delay?: number;
}) {
  const displayWidth = animate === false ? 0 : progress;
  return (
    <div className="exec-kr-compact" title={title}>
      <span className="exec-kr-compact__label"><span className="tree-card-kr-icon">◉</span> {label}</span>
      <div className="exec-kr-compact__bar">
        <div className="exec-kr-compact__bar-fill" style={{ width: `${displayWidth}%`, background: color, transitionDelay: delay ? `${delay}ms` : undefined }} />
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
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, []);

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
          <CircularProgress actualProgress={progress} color={color} size={120} animate={animate} />
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
                animate={animate}
                delay={index * 80}
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
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey(k => k + 1);
  }, [activeFilter]);

  const globalOKRs = okrs.filter(okr => okr.displayId && !okr.parentId);

  const summaryCounts = { 'on-track': 0, progressing: 0, 'off-track': 0 };
  globalOKRs.forEach(okr => {
    const bucket = getSummaryBucket(okr.status || 'off-track');
    summaryCounts[bucket]++;
  });

  const filteredOKRs = (() => {
    if (!activeFilter) return globalOKRs;
    if (['on-track', 'progressing', 'off-track'].includes(activeFilter)) {
      return globalOKRs.filter(okr => getSummaryBucket(okr.status || 'off-track') === activeFilter);
    }
    const actionType = activeFilter.replace('action-', '') as 'overdue' | 'completed' | 'open';
    return globalOKRs.filter(globalOkr => {
      const children = okrs.filter(o => o.parentId === globalOkr.id);
      return children.some(child => {
        const counts = getAreaActionCounts(child.actions || []);
        return counts[actionType] > 0;
      });
    });
  })();

  const actionCounts = { overdue: 0, completed: 0, open: 0 };
  okrs.filter(o => o.parentId).forEach(okr => {
    const counts = getAreaActionCounts(okr.actions || []);
    actionCounts.overdue += counts.overdue;
    actionCounts.completed += counts.completed;
    actionCounts.open += counts.open;
  });

  return (
    <div className="exec-dashboard">
      <header className="exec-dashboard-header">
        <h1>Dashboard</h1>
      </header>

      <div className="exec-summary-header">
        <div className="exec-summary-section">
          <div className="exec-summary-section__title">
OKRs
          </div>
          <div className="exec-summary-section__cards">
            <div className={`exec-metric-card exec-metric-card--green${activeFilter === 'on-track' ? ' exec-metric-card--shadow' : ''}`} onClick={() => setActiveFilter(prev => prev === 'on-track' ? null : 'on-track')} style={{ cursor: 'pointer' }}>
              <div className="exec-metric-card__label"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" stroke="#2CBF96" strokeWidth="2"/><path d="M6 10L9 13L14 7" stroke="#2CBF96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> On track</div>
              <div className="exec-metric-card__count" style={{ color: 'var(--exec-ontrack-count)' }}>{summaryCounts['on-track']}</div>
            </div>
            <div className={`exec-metric-card exec-metric-card--yellow${activeFilter === 'progressing' ? ' exec-metric-card--shadow' : ''}`} onClick={() => setActiveFilter(prev => prev === 'progressing' ? null : 'progressing')} style={{ cursor: 'pointer' }}>
              <div className="exec-metric-card__label"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" stroke="#D08121" strokeWidth="2"/><path d="M6 12L9 9L11 11L14 7" stroke="#D08121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Progressing</div>
              <div className="exec-metric-card__count" style={{ color: 'var(--exec-progressing-count)' }}>{summaryCounts.progressing}</div>
            </div>
            <div className={`exec-metric-card exec-metric-card--red${activeFilter === 'off-track' ? ' exec-metric-card--shadow' : ''}`} onClick={() => setActiveFilter(prev => prev === 'off-track' ? null : 'off-track')} style={{ cursor: 'pointer' }}>
              <div className="exec-metric-card__label"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" stroke="#DB536D" strokeWidth="2"/><path d="M7 7L13 13M13 7L7 13" stroke="#DB536D" strokeWidth="2" strokeLinecap="round"/></svg> Off track</div>
              <div className="exec-metric-card__count" style={{ color: 'var(--exec-offtrack-count)' }}>{summaryCounts['off-track']}</div>
            </div>
          </div>
        </div>

        <div className="exec-summary-section">
          <div className="exec-summary-section__title">
Actions
          </div>
          <div className="exec-summary-section__cards">
            <div className={`exec-metric-card exec-metric-card--overdue${activeFilter === 'action-overdue' ? ' exec-metric-card--shadow' : ''}`} onClick={() => setActiveFilter(prev => prev === 'action-overdue' ? null : 'action-overdue')} style={{ cursor: 'pointer' }}>
              <div className="exec-metric-card__label"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" stroke="#DB536D" strokeWidth="2"/><path d="M10 5V10" stroke="#DB536D" strokeWidth="2" strokeLinecap="round"/><circle cx="10" cy="14" r="1" fill="#DB536D"/></svg> Overdue</div>
              <div className="exec-metric-card__count" style={{ color: 'var(--exec-overdue-count)' }}>{actionCounts.overdue}</div>
            </div>
            <div className={`exec-metric-card exec-metric-card--completed${activeFilter === 'action-completed' ? ' exec-metric-card--shadow' : ''}`} onClick={() => setActiveFilter(prev => prev === 'action-completed' ? null : 'action-completed')} style={{ cursor: 'pointer' }}>
              <div className="exec-metric-card__label"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" stroke="#2CBF96" strokeWidth="2"/><path d="M6 10L9 13L14 7" stroke="#2CBF96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Completed</div>
              <div className="exec-metric-card__count" style={{ color: 'var(--exec-completed-count)' }}>{actionCounts.completed}</div>
            </div>
            <div className={`exec-metric-card exec-metric-card--open${activeFilter === 'action-open' ? ' exec-metric-card--shadow' : ''}`} onClick={() => setActiveFilter(prev => prev === 'action-open' ? null : 'action-open')} style={{ cursor: 'pointer' }}>
              <div className="exec-metric-card__label"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" stroke="black" strokeWidth="2"/><circle cx="10" cy="10" r="3" stroke="black" strokeWidth="2"/></svg> Open</div>
              <div className="exec-metric-card__count" style={{ color: 'var(--exec-open-count)' }}>{actionCounts.open}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="exec-okr-list">
        {filteredOKRs.map(okr => {
          const children = okrs.filter(o => o.parentId === okr.id);
          return <OKRCard key={`${okr.id}-${animationKey}`} globalOkr={okr} children={children} onClick={onOkrClick ? () => onOkrClick(okr.id) : undefined} onActionClick={onActionClick} />;
        })}
      </div>

      {filteredOKRs.length === 0 && (
        <div className="exec-empty-state">
          <p>No Global OKRs found. Create OKRs in the OKR List to see them here.</p>
        </div>
      )}
    </div>
  );
}
