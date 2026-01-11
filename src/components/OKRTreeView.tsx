import { useState, useEffect, useMemo } from 'react';
import { OKR, KeyResult } from '../types';

// Random function names for MVP demo
const FUNCTIONS = ['Supply Chain', 'Finance', 'Ringmaster', 'HR', 'Operations', 'IT'];

// Get status based on progress percentage
const getStatus = (progress: number): { label: string; color: 'green' | 'yellow' | 'red' } => {
  if (progress >= 70) return { label: 'On track', color: 'green' };
  if (progress >= 40) return { label: 'Progressing', color: 'yellow' };
  return { label: 'Off track', color: 'red' };
};

interface OKRTreeViewProps {
  okrs: OKR[];
}

interface TreeCardProps {
  okr: OKR;
  allOkrs: OKR[];
  progressMap: Record<string, number>;
  functionMap: Record<string, string>;
}

// Key Result Card component for child OKRs
interface KeyResultCardProps {
  kr: KeyResult;
  progress: number;
  functionName: string;
}

function KeyResultCard({ kr, progress, functionName }: KeyResultCardProps) {
  const status = getStatus(progress);
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
        <div className={`kr-card-progress-track kr-card-progress-${status.color}`}>
          <div
            className="kr-card-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="kr-card-progress-value">{progress}%</span>
        <span className={`kr-card-status kr-card-status-${status.color}`}>
          ○ {status.label}
        </span>
      </div>
    </div>
  );
}

function TreeCard({ okr, allOkrs, progressMap, functionMap }: TreeCardProps) {
  const children = allOkrs.filter(o => o.parentId === okr.id);
  const isGlobal = !okr.parentId;

  // For child OKRs, split "Area / Objective" format
  const getDepartment = () => {
    // For child OKRs like "GCC India / Deliver savings", extract the area name
    const parts = okr.objective.split('/');
    return parts.length > 1 ? parts[0].trim() : '';
  };

  const getIdentifier = () => {
    if (isGlobal) {
      return `OKR - ${okr.displayId?.replace('OKR-', '') || ''}`;
    }
    return 'OKR';
  };

  const getObjectiveTitle = () => {
    if (isGlobal) {
      return okr.objective;
    }
    // For child OKRs, extract the objective part after "/"
    const parts = okr.objective.split('/');
    return parts.length > 1 ? parts[1].trim() : okr.objective;
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
            {getDepartment() && (
              <span className="tree-card-department-badge">{getDepartment()}</span>
            )}
          </div>

          {/* Separator */}
          <hr className="tree-card-separator" />

          {/* Objective title */}
          <h4 className="tree-card-objective">{getObjectiveTitle()}</h4>
        </div>

        {/* Key Result Cards */}
        {okr.keyResults.length > 0 && (
          <div className="kr-cards-row">
            {okr.keyResults.map((kr) => (
              <KeyResultCard
                key={kr.id}
                kr={kr}
                progress={progressMap[kr.id] || 0}
                functionName={functionMap[kr.id] || 'General'}
              />
            ))}
          </div>
        )}

        {/* Nested children (if any) */}
        {children.length > 0 && (
          <div className="tree-children">
            {children.map(child => (
              <TreeCard key={child.id} okr={child} allOkrs={allOkrs} progressMap={progressMap} functionMap={functionMap} />
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
                <span className="tree-card-metric">{kr.metricName}</span>
                <div className="tree-card-kr-metrics">
                  <span className="tree-card-current">
                    <span className="tree-card-current-label">Current : </span>
                    <span className="tree-card-current-value">{progressMap[kr.id] || 0}%</span>
                  </span>
                  <span className="tree-card-metric-separator"></span>
                  <span className="tree-card-target">
                    {kr.from > 0 && <span className="tree-card-from">{kr.from}%</span>}
                    <span className="tree-card-arrow">→</span>
                    <span className="tree-card-to">{kr.to}%</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {children.length > 0 && (
        <div className="tree-children">
          {children.map(child => (
            <TreeCard key={child.id} okr={child} allOkrs={allOkrs} progressMap={progressMap} functionMap={functionMap} />
          ))}
        </div>
      )}
    </div>
  );
}

export function OKRTreeView({ okrs }: OKRTreeViewProps) {
  const topLevelOkrs = okrs.filter(okr => !okr.parentId);
  const [selectedOkrId, setSelectedOkrId] = useState<string | null>(null);

  // Generate stable random progress values for each key result (20-80%)
  const progressMap = useMemo(() => {
    const map: Record<string, number> = {};
    okrs.forEach(okr => {
      okr.keyResults.forEach(kr => {
        map[kr.id] = Math.floor(Math.random() * 61) + 20; // 20-80%
      });
    });
    return map;
  }, [okrs]);

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
                onClick={() => setSelectedOkrId(okr.id)}
              >
                {okr.displayId && <strong>{okr.displayId}: </strong>}
                {okr.objective}
              </button>
            ))}
          </div>
          <div className="tree-container">
            <div className="tree-root">
              {selectedOkr && (
                <TreeCard okr={selectedOkr} allOkrs={okrs} progressMap={progressMap} functionMap={functionMap} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
