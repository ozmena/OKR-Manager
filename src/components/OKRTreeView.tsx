import { useState, useEffect } from 'react';
import { OKR } from '../types';

interface OKRTreeViewProps {
  okrs: OKR[];
}

interface TreeCardProps {
  okr: OKR;
  allOkrs: OKR[];
}

function TreeCard({ okr, allOkrs }: TreeCardProps) {
  const children = allOkrs.filter(o => o.parentId === okr.id);
  const isGlobal = !okr.parentId;

  // For child OKRs, split "Area / Objective" format
  const getIdentifier = () => {
    if (isGlobal) {
      return `OKR - ${okr.displayId?.replace('OKR-', '') || ''}`;
    }
    // For child OKRs like "GCC India / Deliver savings", extract the area name
    const parts = okr.objective.split('/');
    return parts.length > 1 ? parts[0].trim() : okr.objective;
  };

  const getObjectiveTitle = () => {
    if (isGlobal) {
      return okr.objective;
    }
    // For child OKRs, extract the objective part after "/"
    const parts = okr.objective.split('/');
    return parts.length > 1 ? parts[1].trim() : okr.objective;
  };

  return (
    <div className="tree-node">
      <div className="tree-card">
        {/* Header: Identifier line */}
        <div className="tree-card-header">
          <span
            className={`tree-card-icon ${isGlobal ? 'tree-card-icon-parent' : 'tree-card-icon-child'}`}
            title={isGlobal ? 'Global OKR' : 'Area OKR'}
          >◎</span>
          <span className="tree-card-identifier">{getIdentifier()}</span>
        </div>

        {/* Objective title */}
        <h4 className="tree-card-objective">{getObjectiveTitle()}</h4>

        {/* Separator */}
        <hr className="tree-card-separator" />

        {/* Key results section */}
        <div className="tree-card-krs-section">
          <span className="tree-card-krs-label">Key results</span>
          <ul className="tree-card-krs">
            {okr.keyResults.map((kr) => (
              <li key={kr.id}>
                <span className="tree-card-kr-icon" title="Key Result">◉</span>
                <span className="tree-card-metric">{kr.metricName}</span>
                <span className="tree-card-range">{kr.from}% → {kr.to}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {children.length > 0 && (
        <div className="tree-children">
          {children.map(child => (
            <TreeCard key={child.id} okr={child} allOkrs={allOkrs} />
          ))}
        </div>
      )}
    </div>
  );
}

export function OKRTreeView({ okrs }: OKRTreeViewProps) {
  const topLevelOkrs = okrs.filter(okr => !okr.parentId);
  const [selectedOkrId, setSelectedOkrId] = useState<string | null>(null);

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
                <TreeCard okr={selectedOkr} allOkrs={okrs} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
