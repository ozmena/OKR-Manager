import { OKR } from '../types';
import { OKRCard } from './OKRCard';

interface OKRListProps {
  okrs: OKR[];
  onDelete: (id: string) => void;
  onEdit: (okr: OKR) => void;
  onAddChild: (parentId: string) => void;
}

export function OKRList({ okrs, onDelete, onEdit, onAddChild }: OKRListProps) {
  const topLevelOkrs = okrs.filter(okr => !okr.parentId);

  if (okrs.length === 0) {
    return (
      <div className="empty-state">
        <p>No OKRs yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="okr-list">
      {topLevelOkrs.map((okr) => (
        <OKRCard
          key={okr.id}
          okr={okr}
          allOkrs={okrs}
          onDelete={onDelete}
          onEdit={onEdit}
          onAddChild={onAddChild}
        />
      ))}
    </div>
  );
}
