import { OKR } from '../types';

interface OKRTreeViewProps {
  okrs: OKR[];
  onBack: () => void;
}

interface TreeCardProps {
  okr: OKR;
  allOkrs: OKR[];
}

function TreeCard({ okr, allOkrs }: TreeCardProps) {
  const children = allOkrs.filter(o => o.parentId === okr.id);

  return (
    <div className="tree-node">
      <div className="tree-card">
        <h4 className="tree-card-objective">{okr.objective}</h4>
        <ul className="tree-card-krs">
          {okr.keyResults.map((kr) => (
            <li key={kr.id}>
              <span className="tree-card-metric">{kr.metricName}</span>
              <span className="tree-card-range">{kr.from}% → {kr.to}%</span>
            </li>
          ))}
        </ul>
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

export function OKRTreeView({ okrs, onBack }: OKRTreeViewProps) {
  const topLevelOkrs = okrs.filter(okr => !okr.parentId);

  return (
    <div className="tree-view">
      <div className="tree-header">
        <h2>OKR Tree View</h2>
        <button className="back-btn" onClick={onBack}>
          ← Back to Management
        </button>
      </div>
      {okrs.length === 0 ? (
        <div className="empty-state">
          <p>No OKRs yet. Go back to create your first one!</p>
        </div>
      ) : (
        <div className="tree-container">
          <div className="tree-root">
            {topLevelOkrs.map(okr => (
              <TreeCard key={okr.id} okr={okr} allOkrs={okrs} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
