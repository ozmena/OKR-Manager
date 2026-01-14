import { OKR, formatKRValue } from '../types';

interface OKRCardProps {
  okr: OKR;
  allOkrs: OKR[];
  onDelete: (id: string) => void;
  onEdit: (okr: OKR) => void;
  onAddChild: (parentId: string) => void;
}

export function OKRCard({ okr, allOkrs, onDelete, onEdit, onAddChild }: OKRCardProps) {
  const children = allOkrs.filter(o => o.parentId === okr.id);

  return (
    <div className="okr-card">
      <div className="okr-header">
        <h3 className="okr-objective">{okr.objective}</h3>
        <div className="okr-actions">
          <button className="add-child-btn" onClick={() => onAddChild(okr.id)}>
            + Area OKR
          </button>
          <button className="edit-btn" onClick={() => onEdit(okr)}>
            Edit
          </button>
          <button className="delete-btn" onClick={() => onDelete(okr.id)}>
            Delete
          </button>
        </div>
      </div>
      <ul className="key-results-list">
        {okr.keyResults.map((kr) => (
          <li key={kr.id} className="key-result-item">
            <span className="metric-name">{kr.metricName}</span>
            <span className="metric-range">
              from <strong>{formatKRValue(kr.from, kr.unit)}</strong> to <strong>{formatKRValue(kr.to, kr.unit)}</strong>
            </span>
          </li>
        ))}
      </ul>
      <div className="okr-footer">
        <span className="created-date">
          Created: {new Date(okr.createdAt).toLocaleDateString()}
        </span>
      </div>
      {children.length > 0 && (
        <div className="child-okrs">
          {children.map(child => (
            <OKRCard
              key={child.id}
              okr={child}
              allOkrs={allOkrs}
              onDelete={onDelete}
              onEdit={onEdit}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}
