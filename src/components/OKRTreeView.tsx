import { useState, useEffect, useMemo } from 'react';
import { OKR, KeyResult, KeyResultStatus } from '../types';
import { CheckInModal } from './CheckInModal';

// Random function names for MVP demo
const FUNCTIONS = ['Supply Chain', 'Finance', 'Ringmaster', 'HR', 'Operations', 'IT'];

// Get status display from KeyResult status field
const getStatusDisplay = (status: KeyResultStatus | undefined): { label: string; color: 'green' | 'yellow' | 'red' } => {
  switch (status) {
    case 'on-track': return { label: 'On track', color: 'green' };
    case 'progressing': return { label: 'Progressing', color: 'yellow' };
    case 'off-track': return { label: 'Off track', color: 'red' };
    default: return { label: 'Not set', color: 'yellow' };
  }
};

// Calculate progress percentage from current value
const calculateProgress = (from: number, to: number, current: number | undefined): number => {
  if (current === undefined) return 0;
  const range = to - from;
  if (range === 0) return 100;
  const progress = ((current - from) / range) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
};

interface OKRTreeViewProps {
  okrs: OKR[];
  onUpdateOKR: (okr: OKR) => void;
}

interface TreeCardProps {
  okr: OKR;
  allOkrs: OKR[];
  functionMap: Record<string, string>;
  selectedArea: string;
  onCheckIn: (okr: OKR) => void;
}

// Key Result Card component for child OKRs
interface KeyResultCardProps {
  kr: KeyResult;
  functionName: string;
}

function KeyResultCard({ kr, functionName }: KeyResultCardProps) {
  const progress = calculateProgress(kr.from, kr.to, kr.current);
  const status = getStatusDisplay(kr.status);
  const hasCurrentValue = kr.current !== undefined;
  const hasStatus = kr.status !== undefined;

  return (
    <div className="kr-card">
      <div className="kr-card-header">
        <span className="kr-card-icon">◉</span>
        <span className="kr-card-label">Key Result</span>
        <span className="kr-card-function-badge">{functionName}</span>
      </div>
      <hr className="kr-card-separator" />
      <div className="kr-card-content">
        <span className="kr-card-range">{kr.from}% → {kr.to}%</span>
        <p className="kr-card-description">{kr.metricName}</p>
      </div>
      <div className="kr-card-footer">
        {hasCurrentValue ? (
          <>
            <div className={`kr-card-progress-track kr-card-progress-${hasStatus ? status.color : 'gray'}`}>
              <div
                className="kr-card-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="kr-card-progress-value">{progress}%</span>
            {hasStatus && (
              <span className={`kr-card-status kr-card-status-${status.color}`}>
                ○ {status.label}
              </span>
            )}
          </>
        ) : (
          <span className="kr-card-no-data">No check-in data</span>
        )}
      </div>
    </div>
  );
}

function TreeCard({ okr, allOkrs, functionMap, selectedArea, onCheckIn }: TreeCardProps) {
  const allChildren = allOkrs.filter(o => o.parentId === okr.id);
  // Filter children by selected area (only applies to Area OKRs which have the area field)
  const children = selectedArea === 'all'
    ? allChildren
    : allChildren.filter(child => child.area === selectedArea);
  const isGlobal = !okr.parentId;


  const getIdentifier = () => {
    if (isGlobal) {
      return `OKR - ${okr.displayId?.replace('OKR-', '') || ''}`;
    }
    return 'OKR';
  };

  const getObjectiveTitle = () => {
    return okr.objective;
  };

  // Child OKR: Show simplified card + key result cards
  if (!isGlobal) {
    return (
      <div className="tree-node">
        <div className="tree-card tree-card-child">
          {/* Header with department badge */}
          <div className="tree-card-header tree-card-header-child">
            <div className="tree-card-header-left">
              <span className="tree-card-icon tree-card-icon-child">◎</span>
              <span className="tree-card-identifier">{getIdentifier()}</span>
            </div>
            {okr.area && (
              <span className="tree-card-department-badge">{okr.area}</span>
            )}
          </div>

          {/* Separator */}
          <hr className="tree-card-separator" />

          {/* Objective title */}
          <h4 className="tree-card-objective">{getObjectiveTitle()}</h4>

          {/* Check-in button */}
          <div className="tree-card-footer">
            <button className="tree-card-checkin-btn" onClick={() => onCheckIn(okr)}>
              Check-in <span>›</span>
            </button>
          </div>
        </div>

        {/* Key Result Cards */}
        {okr.keyResults.length > 0 && (
          <div className="kr-cards-row">
            {okr.keyResults.map((kr) => (
              <KeyResultCard
                key={kr.id}
                kr={kr}
                functionName={functionMap[kr.id] || 'General'}
              />
            ))}
          </div>
        )}

        {/* Nested children (if any) */}
        {children.length > 0 && (
          <div className="tree-children">
            {children.map(child => (
              <TreeCard key={child.id} okr={child} allOkrs={allOkrs} functionMap={functionMap} selectedArea={selectedArea} onCheckIn={onCheckIn} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Global OKR: New design with org badge and no progress bars
  return (
    <div className="tree-node">
      <div className="tree-card">
        {/* Header with org badge */}
        <div className="tree-card-header tree-card-header-global">
          <div className="tree-card-header-left">
            <span
              className="tree-card-icon tree-card-icon-parent"
              title="Global OKR"
            >◎</span>
            <span className="tree-card-identifier">{getIdentifier()}</span>
          </div>
          <span className="tree-card-org-badge">GBS</span>
        </div>

        {/* Objective title */}
        <h4 className="tree-card-objective">{getObjectiveTitle()}</h4>

        {/* Separator */}
        <hr className="tree-card-separator" />

        {/* Key results section */}
        <div className="tree-card-krs-section">
          <span className="tree-card-krs-label">Key results</span>
          <ul className="tree-card-krs tree-card-krs-global">
            {okr.keyResults.map((kr) => (
              <li key={kr.id}>
                <span className="tree-card-kr-icon" title="Key Result">◉</span>
                <span className="tree-card-metric" title={kr.metricName}>{kr.metricName}</span>
                <span className="tree-card-target">
                  {kr.from}% → <strong>{kr.to}%</strong>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {children.length > 0 && (
        <div className="tree-children">
          {children.map(child => (
            <TreeCard key={child.id} okr={child} allOkrs={allOkrs} functionMap={functionMap} selectedArea={selectedArea} onCheckIn={onCheckIn} />
          ))}
        </div>
      )}
    </div>
  );
}

export function OKRTreeView({ okrs, onUpdateOKR }: OKRTreeViewProps) {
  const topLevelOkrs = okrs.filter(okr => !okr.parentId);
  const [selectedOkrId, setSelectedOkrId] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [checkInOkr, setCheckInOkr] = useState<OKR | null>(null);

  const handleCheckIn = (okr: OKR) => {
    setCheckInOkr(okr);
  };

  const handleCheckInClose = () => {
    setCheckInOkr(null);
  };

  const handleCheckInSave = (updatedOKR: OKR) => {
    onUpdateOKR(updatedOKR);
  };

  // Generate stable random function names for each key result
  const functionMap = useMemo(() => {
    const map: Record<string, string> = {};
    okrs.forEach(okr => {
      okr.keyResults.forEach(kr => {
        map[kr.id] = FUNCTIONS[Math.floor(Math.random() * FUNCTIONS.length)];
      });
    });
    return map;
  }, [okrs]);

  // Pre-select the first global OKR on load or when OKRs change
  useEffect(() => {
    if (topLevelOkrs.length > 0 && !selectedOkrId) {
      setSelectedOkrId(topLevelOkrs[0].id);
    }
  }, [topLevelOkrs, selectedOkrId]);

  const selectedOkr = okrs.find(okr => okr.id === selectedOkrId);

  // Compute available areas from the selected OKR's children
  const availableAreas = useMemo(() => {
    if (!selectedOkr) return [];
    const childOkrs = okrs.filter(o => o.parentId === selectedOkr.id);
    const areas = [...new Set(childOkrs.map(o => o.area).filter(Boolean))] as string[];
    return areas.sort();
  }, [selectedOkr, okrs]);

  // Handle tab change - reset area filter
  const handleTabChange = (okrId: string) => {
    setSelectedOkrId(okrId);
    setSelectedArea('all');
  };

  return (
    <div className="tree-view">
      {okrs.length === 0 ? (
        <div className="empty-state">
          <p>No OKRs yet. Use the sidebar to go to OKR Manager and create your first one!</p>
        </div>
      ) : (
        <>
          <div className="tree-tabs">
            {topLevelOkrs.map(okr => (
              <button
                key={okr.id}
                className={`tree-tab ${selectedOkrId === okr.id ? 'active' : ''}`}
                onClick={() => handleTabChange(okr.id)}
                title={`${okr.displayId}: ${okr.objective}`}
              >
                {okr.displayId && <strong>{okr.displayId}: </strong>}
                {okr.objective}
              </button>
            ))}
          </div>
          <div className="tree-container">
            {availableAreas.length > 0 && (
              <div className="tree-filter">
                <select
                  id="area-filter"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="tree-filter-select"
                >
                  <option value="all">All Areas</option>
                  {availableAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="tree-root">
              {selectedOkr && (
                <TreeCard okr={selectedOkr} allOkrs={okrs} functionMap={functionMap} selectedArea={selectedArea} onCheckIn={handleCheckIn} />
              )}
            </div>
          </div>
        </>
      )}

      {/* Check-in Modal */}
      <CheckInModal
        isOpen={checkInOkr !== null}
        okr={checkInOkr}
        onClose={handleCheckInClose}
        onSave={handleCheckInSave}
      />
    </div>
  );
}
