import { OKR } from '../types';
import { NotionOKRRow } from './NotionOKRRow';

interface NotionOKRListProps {
  okrs: OKR[];
  onEdit: (okr: OKR) => void;
  onUpdate: (okr: OKR) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
}

export function NotionOKRList({ okrs, onEdit, onUpdate, onDelete, onAddChild }: NotionOKRListProps) {
  const topLevelOkrs = okrs.filter(okr => !okr.parentId);

  if (okrs.length === 0) {
    return (
      <div className="notion-empty">
        <div className="notion-empty-icon">📋</div>
        <p>No OKRs yet</p>
        <p className="notion-empty-hint">Click "+ New" to create your first objective</p>
      </div>
    );
  }

  return (
    <div className="notion-table">
      <div className="notion-header">
        <div className="notion-header-cell notion-header-name">
          <span className="notion-header-icon">≡</span>
          Name
        </div>
        <div className="notion-header-cell notion-header-actions">
          Actions
        </div>
      </div>
      <div className="notion-body">
        {topLevelOkrs.map(okr => (
          <NotionOKRRow
            key={okr.id}
            okr={okr}
            allOkrs={okrs}
            level={0}
            onEdit={onEdit}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onAddChild={onAddChild}
          />
        ))}
      </div>
    </div>
  );
}
