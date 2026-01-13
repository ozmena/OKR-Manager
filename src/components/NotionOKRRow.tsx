import { useState, useRef, useEffect } from 'react';
import { OKR, KeyResult } from '../types';

// Helper to get initials from a full name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface NotionOKRRowProps {
  okr: OKR;
  allOkrs: OKR[];
  level: number;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onEdit: (okr: OKR) => void;
  onUpdate: (okr: OKR) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
}

export function NotionOKRRow({ okr, allOkrs, level, expandedIds, onToggleExpand, onEdit, onUpdate, onDelete, onAddChild }: NotionOKRRowProps) {
  const isExpanded = expandedIds.has(okr.id);
  const [showActions, setShowActions] = useState(false);

  // Inline editing state for objective
  const [isEditingObjective, setIsEditingObjective] = useState(false);
  const [editedObjective, setEditedObjective] = useState(okr.objective);
  const objectiveInputRef = useRef<HTMLInputElement>(null);

  // Inline editing state for key results
  const [editingKrId, setEditingKrId] = useState<string | null>(null);
  const [editedKr, setEditedKr] = useState<KeyResult | null>(null);
  const [hoveringKrId, setHoveringKrId] = useState<string | null>(null);
  const [newKrId, setNewKrId] = useState<string | null>(null);

  const children = allOkrs.filter(o => o.parentId === okr.id);
  const hasChildren = children.length > 0 || okr.keyResults.length > 0;

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingObjective && objectiveInputRef.current) {
      objectiveInputRef.current.focus();
    }
  }, [isEditingObjective]);

  // Handlers for objective editing
  const handleObjectiveClick = () => {
    setIsEditingObjective(true);
    setEditedObjective(okr.objective);
  };

  const handleObjectiveSave = () => {
    if (editedObjective.trim() && editedObjective !== okr.objective) {
      onUpdate({ ...okr, objective: editedObjective.trim() });
    }
    setIsEditingObjective(false);
  };

  const handleObjectiveKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleObjectiveSave();
    } else if (e.key === 'Escape') {
      setEditedObjective(okr.objective);
      setIsEditingObjective(false);
    }
  };

  // Handlers for key result editing
  const handleKrClick = (kr: KeyResult) => {
    setEditingKrId(kr.id);
    setEditedKr({ ...kr });
  };

  const handleKrSave = () => {
    if (editedKr && editingKrId) {
      // If it's a new KR with empty metric name, remove it
      if (newKrId === editingKrId && !editedKr.metricName.trim()) {
        const updatedKeyResults = okr.keyResults.filter(kr => kr.id !== editingKrId);
        onUpdate({ ...okr, keyResults: updatedKeyResults });
      } else {
        const updatedKeyResults = okr.keyResults.map(kr =>
          kr.id === editingKrId ? editedKr : kr
        );
        onUpdate({ ...okr, keyResults: updatedKeyResults });
      }
    }
    setEditingKrId(null);
    setEditedKr(null);
    setNewKrId(null);
  };

  const handleKrKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleKrSave();
    } else if (e.key === 'Escape') {
      // If cancelling a new KR, remove it
      if (newKrId === editingKrId) {
        const updatedKeyResults = okr.keyResults.filter(kr => kr.id !== newKrId);
        onUpdate({ ...okr, keyResults: updatedKeyResults });
      }
      setEditingKrId(null);
      setEditedKr(null);
      setNewKrId(null);
    }
  };

  const handleKrChange = (field: keyof KeyResult, value: string | number) => {
    if (editedKr) {
      setEditedKr({ ...editedKr, [field]: value });
    }
  };

  const handleKrBlur = (e: React.FocusEvent) => {
    // Check if focus is moving to another input within the edit row
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest('.notion-kr-edit-row')) {
      // Focus is moving within the edit row, don't save yet
      return;
    }
    // Focus is leaving the edit row, save now
    handleKrSave();
  };

  const handleKrDelete = (krId: string) => {
    const updatedKeyResults = okr.keyResults.filter(kr => kr.id !== krId);
    onUpdate({ ...okr, keyResults: updatedKeyResults });
  };

  const handleAddKeyResult = () => {
    const newKr: KeyResult = {
      id: crypto.randomUUID(),
      metricName: '',
      from: 0,
      to: 100
    };

    // Expand to show key results
    if (!isExpanded) {
      onToggleExpand(okr.id);
    }

    // Add the new KR to the OKR
    const updatedOkr = { ...okr, keyResults: [...okr.keyResults, newKr] };
    onUpdate(updatedOkr);

    // Track as new and enter edit mode
    setNewKrId(newKr.id);
    setEditingKrId(newKr.id);
    setEditedKr(newKr);
  };

  return (
    <>
      <div
        className={`notion-row ${showActions ? 'notion-row-hover' : ''}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Left-side add button */}
        <button
          className={`notion-add-btn ${showActions && !isEditingObjective ? 'notion-add-btn-visible' : ''}`}
          onClick={handleAddKeyResult}
          title="Add key result"
        >
          +
        </button>

        <div className="notion-row-content" style={{ paddingLeft: `${level * 24 + 8}px` }}>
          <button
            className={`notion-expand-btn ${hasChildren ? '' : 'notion-expand-btn-hidden'}`}
            onClick={() => onToggleExpand(okr.id)}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <span className={`notion-icon ${!okr.parentId ? 'notion-icon-parent' : ''}`} title={!okr.parentId ? 'Global OKR' : 'Area OKR'}>◎</span>

          {isEditingObjective ? (
            <input
              ref={objectiveInputRef}
              type="text"
              className="notion-inline-input"
              value={editedObjective}
              onChange={(e) => setEditedObjective(e.target.value)}
              onBlur={handleObjectiveSave}
              onKeyDown={handleObjectiveKeyDown}
            />
          ) : (
            <span className="notion-title notion-title-editable" onClick={handleObjectiveClick}>
              {okr.displayId && <strong>{okr.displayId}: </strong>}
              {!okr.displayId && okr.area && <strong>{okr.area} - OKR: </strong>}
              {okr.objective}
            </span>
          )}
        </div>
        <div className="notion-row-area">
          {okr.parentId && okr.area && (
            <span className="notion-area-badge">{okr.area}</span>
          )}
        </div>
        <div className="notion-row-owner">
          {okr.owner && (
            <span className="owner-initials" title={okr.owner}>
              {getInitials(okr.owner)}
            </span>
          )}
        </div>
        <div className="notion-row-actions">
          {showActions && !isEditingObjective && (
            <>
              <button className="notion-action-btn" onClick={() => onAddChild(okr.id)} title="Add Area OKR">
                +
              </button>
              <button className="notion-action-btn" onClick={() => onEdit(okr)} title="Edit all">
                ✎
              </button>
              <button className="notion-action-btn notion-action-btn-danger" onClick={() => onDelete(okr.id)} title="Delete">
                ✕
              </button>
            </>
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Key Results */}
          {okr.keyResults.map((kr) => (
            <div
              key={kr.id}
              className={`notion-row notion-row-kr ${hoveringKrId === kr.id ? 'notion-row-hover' : ''}`}
              onMouseEnter={() => setHoveringKrId(kr.id)}
              onMouseLeave={() => setHoveringKrId(null)}
            >
              <div className="notion-row-content" style={{ paddingLeft: `${(level + 1) * 24 + 8}px` }}>
                <span className="notion-expand-btn notion-expand-btn-hidden"></span>
                <span className="notion-icon notion-icon-kr" title="Key Result">◉</span>

                {editingKrId === kr.id && editedKr ? (
                  <div className="notion-kr-edit-row">
                    <input
                      type="text"
                      className="notion-inline-input notion-kr-metric-input"
                      value={editedKr.metricName}
                      onChange={(e) => handleKrChange('metricName', e.target.value)}
                      onBlur={handleKrBlur}
                      onKeyDown={handleKrKeyDown}
                      placeholder="Metric name"
                      autoFocus
                    />
                    <span className="notion-kr-separator">:</span>
                    <input
                      type="number"
                      className="notion-inline-input notion-kr-number-input"
                      value={editedKr.from}
                      onChange={(e) => handleKrChange('from', Number(e.target.value))}
                      onBlur={handleKrBlur}
                      onKeyDown={handleKrKeyDown}
                      min="0"
                      max="100"
                    />
                    <span className="notion-kr-separator">% →</span>
                    <input
                      type="number"
                      className="notion-inline-input notion-kr-number-input"
                      value={editedKr.to}
                      onChange={(e) => handleKrChange('to', Number(e.target.value))}
                      onBlur={handleKrBlur}
                      onKeyDown={handleKrKeyDown}
                      min="0"
                      max="100"
                    />
                    <span className="notion-kr-separator">%</span>
                  </div>
                ) : (
                  <span className="notion-title notion-title-kr notion-title-editable" onClick={() => handleKrClick(kr)}>
                    <strong>KR:</strong> {kr.metricName}: {kr.from}% → {kr.to}%
                  </span>
                )}
              </div>
              <div className="notion-row-area">
                {/* Empty for key results */}
              </div>
              <div className="notion-row-owner">
                {/* Empty for key results */}
              </div>
              <div className="notion-row-actions">
                {hoveringKrId === kr.id && editingKrId !== kr.id && (
                  <>
                    <button className="notion-action-btn" onClick={() => handleKrClick(kr)} title="Edit">
                      ✎
                    </button>
                    <button className="notion-action-btn notion-action-btn-danger" onClick={() => handleKrDelete(kr.id)} title="Delete">
                      ✕
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Child OKRs */}
          {children.map(child => (
            <NotionOKRRow
              key={child.id}
              okr={child}
              allOkrs={allOkrs}
              level={level + 1}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onEdit={onEdit}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </>
      )}
    </>
  );
}
