import { OKR } from '../types';
import { NotionOKRRow } from './NotionOKRRow';

interface NotionOKRListProps {
  okrs: OKR[];
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onEdit: (okr: OKR) => void;
  onUpdate: (okr: OKR) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
}

export function NotionOKRList({ okrs, expandedIds, onToggleExpand, onEdit, onUpdate, onDelete, onAddChild }: NotionOKRListProps) {
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
          OKR
        </div>
        <div className="notion-header-cell notion-header-area">
          Area
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
            expandedIds={expandedIds}
            onToggleExpand={onToggleExpand}
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
