import { useMemo } from 'react';
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
  searchQuery: string;
}

// Helper to check if OKR or its descendants match search
const okrMatchesSearch = (okr: OKR, allOkrs: OKR[], query: string): boolean => {
  const q = query.toLowerCase();
  // Check objective
  if (okr.objective.toLowerCase().includes(q)) return true;
  // Check key results
  if (okr.keyResults.some(kr => kr.metricName.toLowerCase().includes(q))) return true;
  // Check area and owner
  if (okr.area?.toLowerCase().includes(q)) return true;
  if (okr.owner?.toLowerCase().includes(q)) return true;
  // Check children recursively
  const children = allOkrs.filter(o => o.parentId === okr.id);
  return children.some(child => okrMatchesSearch(child, allOkrs, query));
};

export function NotionOKRList({ okrs, expandedIds, onToggleExpand, onEdit, onUpdate, onDelete, onAddChild, searchQuery }: NotionOKRListProps) {
  const topLevelOkrs = okrs.filter(okr => !okr.parentId);

  // Filter top-level OKRs based on search query
  const filteredTopLevelOkrs = useMemo(() => {
    if (!searchQuery) return topLevelOkrs;
    return topLevelOkrs.filter(okr => okrMatchesSearch(okr, okrs, searchQuery));
  }, [topLevelOkrs, okrs, searchQuery]);

  // Auto-expand OKRs when searching
  const effectiveExpandedIds = useMemo(() => {
    if (!searchQuery) return expandedIds;
    const ids = new Set(expandedIds);
    // Auto-expand all filtered OKRs and their children
    filteredTopLevelOkrs.forEach(okr => {
      ids.add(okr.id);
      okrs.filter(o => o.parentId === okr.id).forEach(child => ids.add(child.id));
    });
    return ids;
  }, [searchQuery, filteredTopLevelOkrs, expandedIds, okrs]);

  if (okrs.length === 0) {
    return (
      <div className="notion-empty">
        <div className="notion-empty-icon">📋</div>
        <p>No OKRs yet</p>
        <p className="notion-empty-hint">Click "+ New" to create your first objective</p>
      </div>
    );
  }

  // Show "no results" message when search has no matches
  if (searchQuery && filteredTopLevelOkrs.length === 0) {
    return (
      <div className="notion-empty">
        <div className="notion-empty-icon">🔍</div>
        <p>No OKRs found</p>
        <p className="notion-empty-hint">Try a different search term</p>
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
        <div className="notion-header-cell notion-header-owner">
          Owner
        </div>
        <div className="notion-header-cell notion-header-quality">
          Quality
        </div>
        <div className="notion-header-cell notion-header-actions">
          Actions
        </div>
      </div>
      <div className="notion-body">
        {filteredTopLevelOkrs.map(okr => (
          <NotionOKRRow
            key={okr.id}
            okr={okr}
            allOkrs={okrs}
            level={0}
            expandedIds={effectiveExpandedIds}
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
