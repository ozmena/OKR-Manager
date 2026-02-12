import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { OKR, KeyResult, KeyResultStatus, formatKRValue } from '../types';
import { CheckInModal } from './CheckInModal';
import { AIFeedbackModal } from './AIFeedbackModal';
import { getTreeAIFeedback, TreeOKRData, AISuggestion } from '../services/aiService';


// Mode type for the view
type ViewMode = 'tracking' | 'setting';

// Editing field type
interface EditingField {
  okrId: string;
  field: 'objective' | 'krMetric' | 'krFrom' | 'krTo';
  krId?: string;
}

// Helper to get initials from a full name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

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
  mode: ViewMode;
  initialSelectedOkrId?: string | null;
  onInitialOkrConsumed?: () => void;
  initialCheckInOkrId?: string | null;
  onInitialCheckInConsumed?: () => void;
}

interface TreeCardProps {
  okr: OKR;
  allOkrs: OKR[];
  functionMap: Record<string, string>;
  selectedArea: string;
  selectedOwner: string;
  onCheckIn: (okr: OKR) => void;
  mode: ViewMode;
  editingField: EditingField | null;
  editValue: string;
  onStartEdit: (okrId: string, field: EditingField['field'], value: string, krId?: string) => void;
  onEditChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onGetAIFeedback?: () => void;
}

// Key Result Card component for child OKRs
interface KeyResultCardProps {
  kr: KeyResult;
  okrId: string;
  functionName?: string;
  mode: ViewMode;
  editingField: EditingField | null;
  editValue: string;
  onStartEdit: (okrId: string, field: EditingField['field'], value: string, krId?: string) => void;
  onEditChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

function KeyResultCard({ kr, okrId, functionName, mode, editingField, editValue, onStartEdit, onEditChange, onSaveEdit, onCancelEdit }: KeyResultCardProps) {
  const progress = calculateProgress(kr.from, kr.to, kr.current);
  const status = getStatusDisplay(kr.status);
  const hasCurrentValue = kr.current !== undefined;
  const hasStatus = kr.status !== undefined;

  const isEditingMetric = editingField?.okrId === okrId && editingField.field === 'krMetric' && editingField.krId === kr.id;
  const isEditingFrom = editingField?.okrId === okrId && editingField.field === 'krFrom' && editingField.krId === kr.id;
  const isEditingTo = editingField?.okrId === okrId && editingField.field === 'krTo' && editingField.krId === kr.id;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSaveEdit();
    if (e.key === 'Escape') onCancelEdit();
  };

  return (
    <div className="kr-card">
      <div className="kr-card-header">
        <span className="kr-card-icon">◉</span>
        <span className="kr-card-label">Key Result</span>
        {functionName && <span className="kr-card-function-badge">{functionName}</span>}
      </div>
      <hr className="kr-card-separator" />
      <div className="kr-card-content">
        <span className="kr-card-range">
          {isEditingFrom ? (
            <input
              type="number"
              className="inline-edit-input inline-edit-input-small"
              value={editValue}
              onChange={(e) => onEditChange(e.target.value)}
              onBlur={onSaveEdit}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <span
              className={mode === 'setting' ? 'editable-field' : ''}
              onClick={() => mode === 'setting' && onStartEdit(okrId, 'krFrom', String(kr.from), kr.id)}
            >
              {formatKRValue(kr.from, kr.unit)}
            </span>
          )}
          {' → '}
          {isEditingTo ? (
            <input
              type="number"
              className="inline-edit-input inline-edit-input-small"
              value={editValue}
              onChange={(e) => onEditChange(e.target.value)}
              onBlur={onSaveEdit}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <span
              className={mode === 'setting' ? 'editable-field' : ''}
              onClick={() => mode === 'setting' && onStartEdit(okrId, 'krTo', String(kr.to), kr.id)}
            >
              {formatKRValue(kr.to, kr.unit)}
            </span>
          )}
        </span>
        {isEditingMetric ? (
          <input
            type="text"
            className="inline-edit-input"
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            onBlur={onSaveEdit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <p
            className={`kr-card-description ${mode === 'setting' ? 'editable-field' : ''}`}
            onClick={() => mode === 'setting' && onStartEdit(okrId, 'krMetric', kr.metricName, kr.id)}
          >
            {kr.metricName}
          </p>
        )}
      </div>
      <div className="kr-card-footer">
        {mode === 'tracking' ? (
          hasCurrentValue ? (
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
          )
        ) : null}
      </div>
    </div>
  );
}

function TreeCard({ okr, allOkrs, functionMap, selectedArea, selectedOwner, onCheckIn, mode, editingField, editValue, onStartEdit, onEditChange, onSaveEdit, onCancelEdit, onGetAIFeedback }: TreeCardProps) {
  const allChildren = allOkrs.filter(o => o.parentId === okr.id);
  // Filter children by selected area and owner
  const children = allChildren.filter(child => {
    const areaMatch = selectedArea === 'all' || child.area === selectedArea;
    const ownerMatch = selectedOwner === 'all' || child.owner === selectedOwner;
    return areaMatch && ownerMatch;
  });
  const isGlobal = !okr.parentId;

  const isEditingObjective = editingField?.okrId === okr.id && editingField.field === 'objective';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSaveEdit();
    if (e.key === 'Escape') onCancelEdit();
  };

  const getIdentifier = () => {
    if (isGlobal) {
      return `OKR - ${okr.displayId?.replace('OKR-', '') || ''}`;
    }
    return 'OKR';
  };

  // Child OKR: Show simplified card + key result cards
  if (!isGlobal) {
    return (
      <div className="tree-node">
        <div className="tree-card tree-card-child">
          {/* Header with owner and department badge */}
          <div className="tree-card-header tree-card-header-child">
            <div className="tree-card-header-left">
              <span className="tree-card-icon tree-card-icon-child">◎</span>
              <span className="tree-card-identifier">{getIdentifier()}</span>
            </div>
            <div className="tree-card-header-right">
              {okr.owner && (
                <span className="tree-card-owner-initials" title={okr.owner}>
                  {getInitials(okr.owner)}
                </span>
              )}
              {okr.area && (
                <span className="tree-card-department-badge">{okr.area}</span>
              )}
            </div>
          </div>

          {/* Separator */}
          <hr className="tree-card-separator" />

          {/* Objective title */}
          {isEditingObjective ? (
            <textarea
              className="inline-edit-input inline-edit-textarea"
              value={editValue}
              onChange={(e) => onEditChange(e.target.value)}
              onBlur={onSaveEdit}
              onKeyDown={(e) => {
                if (e.key === 'Escape') onCancelEdit();
                // Allow Enter for newlines in textarea, use blur to save
              }}
              autoFocus
              rows={3}
            />
          ) : (
            <h4
              className={`tree-card-objective ${mode === 'setting' ? 'editable-field' : ''}`}
              title={okr.objective}
              onClick={() => mode === 'setting' && onStartEdit(okr.id, 'objective', okr.objective)}
            >
              {okr.objective}
            </h4>
          )}

          {/* Footer with check-in button */}
          <div className={`tree-card-footer ${mode !== 'tracking' ? 'tree-card-footer-hidden' : ''}`}>
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
                okrId={okr.id}
                functionName={functionMap[kr.id]}
                mode={mode}
                editingField={editingField}
                editValue={editValue}
                onStartEdit={onStartEdit}
                onEditChange={onEditChange}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
              />
            ))}
          </div>
        )}

        {/* Nested children (if any) */}
        {children.length > 0 && (
          <div className="tree-children">
            {children.map(child => (
              <TreeCard
                key={child.id}
                okr={child}
                allOkrs={allOkrs}
                functionMap={functionMap}
                selectedArea={selectedArea}
                selectedOwner={selectedOwner}
                onCheckIn={onCheckIn}
                mode={mode}
                editingField={editingField}
                editValue={editValue}
                onStartEdit={onStartEdit}
                onEditChange={onEditChange}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Global OKR: New design with org badge
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
          <div className="tree-card-header-right">
            {okr.owner && (
              <span className="tree-card-owner-initials" title={okr.owner}>
                {getInitials(okr.owner)}
              </span>
            )}
            {mode === 'tracking' && okr.status && (
              <span className={`kr-card-status kr-card-status-${getStatusDisplay(okr.status as KeyResultStatus).color}`}>
                ○ {getStatusDisplay(okr.status as KeyResultStatus).label}
              </span>
            )}
            {mode === 'setting' && (
              <button
                className="tree-card-ai-btn"
                title="Get AI feedback on this OKR"
                onClick={(e) => { e.stopPropagation(); onGetAIFeedback?.(); }}
              >
                ✨
              </button>
            )}
          </div>
        </div>

        {/* Objective title */}
        {isEditingObjective ? (
          <textarea
            className="inline-edit-input inline-edit-textarea"
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            onBlur={onSaveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onCancelEdit();
            }}
            autoFocus
            rows={3}
          />
        ) : (
          <h4
            className={`tree-card-objective ${mode === 'setting' ? 'editable-field' : ''}`}
            title={okr.objective}
            onClick={() => mode === 'setting' && onStartEdit(okr.id, 'objective', okr.objective)}
          >
            {okr.objective}
          </h4>
        )}

        {/* Separator */}
        <hr className="tree-card-separator" />

        {/* Key results section */}
        <div className="tree-card-krs-section">
          <span className="tree-card-krs-label">Key results</span>
          <ul className="tree-card-krs tree-card-krs-global">
            {okr.keyResults.map((kr) => {
              const hasCurrentValue = kr.current !== undefined;
              const progress = calculateProgress(kr.from, kr.to, kr.current);
              const statusColor = getStatusDisplay(kr.status).color;
              const isEditingMetric = editingField?.okrId === okr.id && editingField.field === 'krMetric' && editingField.krId === kr.id;
              const isEditingFrom = editingField?.okrId === okr.id && editingField.field === 'krFrom' && editingField.krId === kr.id;
              const isEditingTo = editingField?.okrId === okr.id && editingField.field === 'krTo' && editingField.krId === kr.id;

              return (
                <li key={kr.id}>
                  <span className="tree-card-kr-icon" title="Key Result">◉</span>
                  <span
                    className={`tree-card-metric ${mode === 'setting' && !isEditingMetric ? 'editable-field' : ''}`}
                    style={{ visibility: isEditingMetric ? 'hidden' : 'visible' }}
                    title={kr.metricName}
                    onClick={() => mode === 'setting' && !isEditingMetric && onStartEdit(okr.id, 'krMetric', kr.metricName, kr.id)}
                  >
                    {kr.metricName}
                  </span>
                  {isEditingMetric && (
                    <textarea
                      className="inline-edit-textarea inline-edit-textarea-metric"
                      value={editValue}
                      onChange={(e) => onEditChange(e.target.value)}
                      onBlur={onSaveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') onCancelEdit();
                      }}
                      rows={2}
                      autoFocus
                    />
                  )}
                  {mode === 'tracking' && hasCurrentValue && (
                    <div className={`tree-card-kr-progress tree-card-kr-progress-${statusColor}`}>
                      <div
                        className="tree-card-kr-progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                  <span className="tree-card-target">
                    {isEditingFrom ? (
                      <input
                        type="number"
                        className="inline-edit-input inline-edit-input-small"
                        value={editValue}
                        onChange={(e) => onEditChange(e.target.value)}
                        onBlur={onSaveEdit}
                        onKeyDown={handleKeyDown}
                        autoFocus
                      />
                    ) : (
                      <span
                        className={mode === 'setting' ? 'editable-field' : ''}
                        onClick={() => mode === 'setting' && onStartEdit(okr.id, 'krFrom', String(kr.from), kr.id)}
                      >
                        {formatKRValue(kr.from, kr.unit)}
                      </span>
                    )}
                    {' → '}
                    {isEditingTo ? (
                      <input
                        type="number"
                        className="inline-edit-input inline-edit-input-small"
                        value={editValue}
                        onChange={(e) => onEditChange(e.target.value)}
                        onBlur={onSaveEdit}
                        onKeyDown={handleKeyDown}
                        autoFocus
                      />
                    ) : (
                      <strong>
                        <span
                          className={mode === 'setting' ? 'editable-field' : ''}
                          onClick={() => mode === 'setting' && onStartEdit(okr.id, 'krTo', String(kr.to), kr.id)}
                        >
                          {formatKRValue(kr.to, kr.unit)}
                        </span>
                      </strong>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer with check-in button */}
        <div className={`tree-card-footer tree-card-footer-global ${mode !== 'tracking' ? 'tree-card-footer-hidden' : ''}`}>
          <button className="tree-card-checkin-btn" onClick={() => onCheckIn(okr)}>
            Check-in <span>›</span>
          </button>
        </div>
      </div>
      {children.length > 0 && (
        <div className="tree-children">
          {children.map(child => (
            <TreeCard
              key={child.id}
              okr={child}
              allOkrs={allOkrs}
              functionMap={functionMap}
              selectedArea={selectedArea}
              selectedOwner={selectedOwner}
              onCheckIn={onCheckIn}
              mode={mode}
              editingField={editingField}
              editValue={editValue}
              onStartEdit={onStartEdit}
              onEditChange={onEditChange}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function OKRTreeView({ okrs, onUpdateOKR, mode, initialSelectedOkrId, onInitialOkrConsumed, initialCheckInOkrId, onInitialCheckInConsumed }: OKRTreeViewProps) {
  const topLevelOkrs = okrs.filter(okr => !okr.parentId);
  const [selectedOkrId, setSelectedOkrId] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedOwner, setSelectedOwner] = useState<string>('all');
  const [checkInOkr, setCheckInOkr] = useState<OKR | null>(null);
  const [scrollToActionsOnOpen, setScrollToActionsOnOpen] = useState(false);

  // Inline editing state
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [editValue, setEditValue] = useState('');

  // Tree AI Feedback state
  const [showTreeAIFeedback, setShowTreeAIFeedback] = useState(false);
  const [treeAIFeedback, setTreeAIFeedback] = useState<string | null>(null);
  const [treeAISuggestion, setTreeAISuggestion] = useState<AISuggestion | null>(null);
  const [treeAILoading, setTreeAILoading] = useState(false);
  const [treeAIError, setTreeAIError] = useState<string | null>(null);

  // Scroll state and ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // Update scroll buttons on mount and resize
  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, [updateScrollButtons]);

  // Update scroll buttons when selected OKR changes (content changes)
  useEffect(() => {
    // Small delay to let content render
    const timer = setTimeout(updateScrollButtons, 100);
    return () => clearTimeout(timer);
  }, [selectedOkrId, selectedArea, selectedOwner, updateScrollButtons]);

  const handleCheckIn = (okr: OKR) => {
    setCheckInOkr(okr);
  };

  const handleCheckInClose = () => {
    setCheckInOkr(null);
    setScrollToActionsOnOpen(false);
  };

  const handleCheckInSave = (updatedOKR: OKR) => {
    onUpdateOKR(updatedOKR);
  };

  // Inline editing handlers
  const handleStartEdit = (okrId: string, field: EditingField['field'], value: string, krId?: string) => {
    setEditingField({ okrId, field, krId });
    setEditValue(value);
  };

  const handleEditChange = (value: string) => {
    setEditValue(value);
  };

  const handleSaveEdit = () => {
    if (!editingField) return;

    const okr = okrs.find(o => o.id === editingField.okrId);
    if (!okr) {
      setEditingField(null);
      return;
    }

    let updatedOkr: OKR;

    if (editingField.field === 'objective') {
      updatedOkr = { ...okr, objective: editValue.trim() || okr.objective };
    } else if (editingField.krId) {
      const updatedKeyResults = okr.keyResults.map(kr => {
        if (kr.id !== editingField.krId) return kr;

        switch (editingField.field) {
          case 'krMetric':
            return { ...kr, metricName: editValue.trim() || kr.metricName };
          case 'krFrom':
            const fromVal = parseFloat(editValue);
            return { ...kr, from: isNaN(fromVal) ? kr.from : fromVal };
          case 'krTo':
            const toVal = parseFloat(editValue);
            return { ...kr, to: isNaN(toVal) ? kr.to : toVal };
          default:
            return kr;
        }
      });
      updatedOkr = { ...okr, keyResults: updatedKeyResults };
    } else {
      setEditingField(null);
      return;
    }

    onUpdateOKR(updatedOkr);
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  // Tree AI Feedback handler
  const handleGetTreeAIFeedback = async () => {
    if (!selectedOkr) return;

    setShowTreeAIFeedback(true);
    setTreeAILoading(true);
    setTreeAIError(null);
    setTreeAIFeedback(null);
    setTreeAISuggestion(null);

    // Get filtered children (respecting area/owner filters)
    const children = okrs.filter(o => {
      if (o.parentId !== selectedOkr.id) return false;
      const areaMatch = selectedArea === 'all' || o.area === selectedArea;
      const ownerMatch = selectedOwner === 'all' || o.owner === selectedOwner;
      return areaMatch && ownerMatch;
    });

    const treeData: TreeOKRData = {
      globalOKR: {
        objective: selectedOkr.objective,
        keyResults: selectedOkr.keyResults.map(kr => ({
          metricName: kr.metricName,
          from: kr.from,
          to: kr.to,
          unit: kr.unit
        }))
      },
      areaOKRs: children.map(child => ({
        area: child.area || 'Unspecified',
        objective: child.objective,
        keyResults: child.keyResults.map(kr => ({
          metricName: kr.metricName,
          from: kr.from,
          to: kr.to,
          unit: kr.unit
        }))
      }))
    };

    const result = await getTreeAIFeedback(treeData);

    setTreeAILoading(false);
    if (result.success) {
      setTreeAIFeedback(result.feedback || null);
      setTreeAISuggestion(result.suggestion || null);
    } else {
      setTreeAIError(result.error || 'Unknown error');
    }
  };

  // Handle applying AI suggestion
  const handleApplySuggestion = (suggestion: AISuggestion) => {
    if (!selectedOkr) return;

    if (!suggestion.area) {
      // Global OKR suggestion
      if (suggestion.type === 'objective') {
        const updatedOkr = { ...selectedOkr, objective: suggestion.proposed };
        onUpdateOKR(updatedOkr);
      } else if (suggestion.type === 'keyResult' && suggestion.krIndex !== undefined) {
        const updatedKeyResults = [...selectedOkr.keyResults];
        if (updatedKeyResults[suggestion.krIndex]) {
          updatedKeyResults[suggestion.krIndex] = {
            ...updatedKeyResults[suggestion.krIndex],
            metricName: suggestion.proposed
          };
          const updatedOkr = { ...selectedOkr, keyResults: updatedKeyResults };
          onUpdateOKR(updatedOkr);
        }
      }
    } else {
      // Area OKR suggestion
      const areaOkr = okrs.find(o => o.parentId === selectedOkr.id && o.area === suggestion.area);
      if (areaOkr) {
        if (suggestion.type === 'objective') {
          const updatedOkr = { ...areaOkr, objective: suggestion.proposed };
          onUpdateOKR(updatedOkr);
        } else if (suggestion.type === 'keyResult' && suggestion.krIndex !== undefined) {
          const updatedKeyResults = [...areaOkr.keyResults];
          if (updatedKeyResults[suggestion.krIndex]) {
            updatedKeyResults[suggestion.krIndex] = {
              ...updatedKeyResults[suggestion.krIndex],
              metricName: suggestion.proposed
            };
            const updatedOkr = { ...areaOkr, keyResults: updatedKeyResults };
            onUpdateOKR(updatedOkr);
          }
        }
      }
    }
  };

  // Map key result IDs to their function names
  const functionMap = useMemo(() => {
    const map: Record<string, string> = {};
    okrs.forEach(okr => {
      okr.keyResults.forEach(kr => {
        if (kr.function) {
          map[kr.id] = kr.function;
        }
      });
    });
    return map;
  }, [okrs]);

  // Pre-select an OKR: use initialSelectedOkrId if provided, otherwise first global OKR
  useEffect(() => {
    if (initialSelectedOkrId) {
      setSelectedOkrId(initialSelectedOkrId);
      onInitialOkrConsumed?.();
    } else if (topLevelOkrs.length > 0 && !selectedOkrId) {
      setSelectedOkrId(topLevelOkrs[0].id);
    }
  }, [initialSelectedOkrId, topLevelOkrs, selectedOkrId]);

  // Auto-open check-in modal when navigating from dashboard action badge
  useEffect(() => {
    if (initialCheckInOkrId) {
      const targetOkr = okrs.find(o => o.id === initialCheckInOkrId);
      if (targetOkr) {
        setCheckInOkr(targetOkr);
        setScrollToActionsOnOpen(true);
      }
      onInitialCheckInConsumed?.();
    }
  }, [initialCheckInOkrId, okrs]);

  const selectedOkr = okrs.find(okr => okr.id === selectedOkrId);

  // Compute available areas from the selected OKR's children
  const availableAreas = useMemo(() => {
    if (!selectedOkr) return [];
    const childOkrs = okrs.filter(o => o.parentId === selectedOkr.id);
    const areas = [...new Set(childOkrs.map(o => o.area).filter(Boolean))] as string[];
    return areas.sort();
  }, [selectedOkr, okrs]);

  // Compute available owners from the selected OKR's children (not including global OKR)
  const availableOwners = useMemo(() => {
    if (!selectedOkr) return [];
    const childOkrs = okrs.filter(o => o.parentId === selectedOkr.id);
    const owners = childOkrs.map(o => o.owner).filter(Boolean) as string[];
    return [...new Set(owners)].sort();
  }, [selectedOkr, okrs]);

  // Handle tab change - reset area and owner filters
  const handleTabChange = (okrId: string) => {
    setSelectedOkrId(okrId);
    setSelectedArea('all');
    setSelectedOwner('all');
  };

  return (
    <div className="tree-view">
      {okrs.length === 0 ? (
        <div className="empty-state">
          <p>No OKRs yet. Use the sidebar to go to OKR Manager and create your first one!</p>
        </div>
      ) : (
        <>
          {/* Wrapper that shrinks to tabs width for alignment */}
          <div className="tree-tabs-wrapper">
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

            {/* Controls row - filters left, button right */}
            <div className="tree-controls">
              {(availableAreas.length > 0 || availableOwners.length > 0) && (
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
                  <select
                    id="owner-filter"
                    value={selectedOwner}
                    onChange={(e) => setSelectedOwner(e.target.value)}
                    className="tree-filter-select"
                  >
                    <option value="all">All Owners</option>
                    {availableOwners.map(owner => (
                      <option key={owner} value={owner}>{owner}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="tree-container-wrapper">
            {canScrollLeft && (
              <button className="tree-scroll-btn tree-scroll-btn-left" onClick={scrollLeft} aria-label="Scroll left">
                ‹
              </button>
            )}
            {canScrollRight && (
              <button className="tree-scroll-btn tree-scroll-btn-right" onClick={scrollRight} aria-label="Scroll right">
                ›
              </button>
            )}
            <div className="tree-container" ref={scrollContainerRef} onScroll={updateScrollButtons}>
              <div className="tree-root">
                {selectedOkr && (
                  <TreeCard
                    okr={selectedOkr}
                    allOkrs={okrs}
                    functionMap={functionMap}
                    selectedArea={selectedArea}
                    selectedOwner={selectedOwner}
                    onCheckIn={handleCheckIn}
                    mode={mode}
                    editingField={editingField}
                    editValue={editValue}
                    onStartEdit={handleStartEdit}
                    onEditChange={handleEditChange}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                    onGetAIFeedback={handleGetTreeAIFeedback}
                  />
                )}
              </div>
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
        scrollToActions={scrollToActionsOnOpen}
      />

      {/* Tree AI Feedback Modal */}
      <AIFeedbackModal
        isOpen={showTreeAIFeedback}
        onClose={() => setShowTreeAIFeedback(false)}
        feedback={treeAIFeedback}
        isLoading={treeAILoading}
        error={treeAIError}
        suggestion={treeAISuggestion}
        onApplySuggestion={handleApplySuggestion}
      />
    </div>
  );
}
