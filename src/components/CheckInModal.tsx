import { useState, useEffect } from 'react';
import { OKR, OKRStatus, KeyResult, KeyResultStatus, formatKRValue, Action, PEOPLE } from '../types';

interface CheckInModalProps {
  isOpen: boolean;
  okr: OKR | null;
  onClose: () => void;
  onSave: (updatedOKR: OKR) => void;
  scrollToActions?: boolean;
}

interface KeyResultFormData {
  current: number | undefined;
  status: KeyResultStatus | undefined;
}

// Calculate progress percentage
function calculateProgress(from: number, to: number, current: number | undefined): number {
  if (current === undefined) return 0;
  const range = to - from;
  if (range === 0) return 100;
  const progress = ((current - from) / range) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
}

// Get color based on status
function getStatusColor(status: KeyResultStatus | undefined): 'green' | 'yellow' | 'red' | 'gray' {
  switch (status) {
    case 'on-track': return 'green';
    case 'progressing': return 'yellow';
    case 'off-track': return 'red';
    default: return 'gray';
  }
}

// Helper to check if action is overdue
function isOverdue(dueDate: string, completed: boolean): boolean {
  if (completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  return due < today;
}

// Helper to format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Helper to calculate days overdue
function getDaysOverdue(dueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diffTime = today.getTime() - due.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Generate a simple unique ID
function generateId(): string {
  return crypto.randomUUID();
}

export function CheckInModal({ isOpen, okr, onClose, onSave, scrollToActions }: CheckInModalProps) {
  const [keyResultsData, setKeyResultsData] = useState<Record<string, KeyResultFormData>>({});
  const [challenges, setChallenges] = useState('');
  const [needs, setNeeds] = useState('');
  const [comments, setComments] = useState('');
  const [actions, setActions] = useState<Action[]>([]);
  const [showAddAction, setShowAddAction] = useState(false);
  const [newActionText, setNewActionText] = useState('');
  const [newActionOwner, setNewActionOwner] = useState('');
  const [newActionDueDate, setNewActionDueDate] = useState('');
  const [krExpanded, setKrExpanded] = useState(true);
  const [okrStatus, setOkrStatus] = useState<OKRStatus | undefined>(undefined);

  // Initialize form data when modal opens
  useEffect(() => {
    if (okr) {
      const initialData: Record<string, KeyResultFormData> = {};
      okr.keyResults.forEach(kr => {
        initialData[kr.id] = {
          current: kr.current,
          status: kr.status,
        };
      });
      setKeyResultsData(initialData);
      setChallenges(okr.challenges || '');
      setNeeds(okr.needs || '');
      setComments(okr.comments || '');
      setActions(okr.actions || []);
      setShowAddAction(false);
      setNewActionText('');
      setNewActionOwner('');
      setNewActionDueDate('');
      setOkrStatus(okr.status);
    }
  }, [okr]);

  // Scroll to actions section when opened from dashboard action badge
  useEffect(() => {
    if (isOpen && scrollToActions) {
      setTimeout(() => {
        document.getElementById('checkin-actions')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [isOpen, scrollToActions]);

  if (!isOpen || !okr) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCurrentChange = (krId: string, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    setKeyResultsData(prev => ({
      ...prev,
      [krId]: { ...prev[krId], current: numValue },
    }));
  };

  const handleStatusChange = (krId: string, status: KeyResultStatus) => {
    setKeyResultsData(prev => ({
      ...prev,
      [krId]: { ...prev[krId], status },
    }));
  };

  const handleAddAction = () => {
    if (!newActionText.trim() || !newActionOwner || !newActionDueDate) return;

    const newAction: Action = {
      id: generateId(),
      text: newActionText.trim(),
      owner: newActionOwner,
      dueDate: newActionDueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setActions(prev => [...prev, newAction]);
    setNewActionText('');
    setNewActionOwner('');
    setNewActionDueDate('');
    setShowAddAction(false);
  };

  const handleToggleAction = (actionId: string) => {
    setActions(prev => prev.map(action => {
      if (action.id === actionId) {
        return {
          ...action,
          completed: !action.completed,
          completedAt: !action.completed ? new Date().toISOString() : undefined,
        };
      }
      return action;
    }));
  };

  const handleDeleteAction = (actionId: string) => {
    setActions(prev => prev.filter(action => action.id !== actionId));
  };

  // Group actions by status
  const overdueActions = actions.filter(a => isOverdue(a.dueDate, a.completed));
  const openActions = actions.filter(a => !a.completed && !isOverdue(a.dueDate, a.completed));
  const completedActions = actions.filter(a => a.completed);

  const handleSave = () => {
    const updatedKeyResults: KeyResult[] = okr.keyResults.map(kr => ({
      ...kr,
      current: keyResultsData[kr.id]?.current,
      status: keyResultsData[kr.id]?.status || undefined,
    }));

    const updatedOKR: OKR = {
      ...okr,
      keyResults: updatedKeyResults,
      status: okrStatus,
      challenges: challenges || undefined,
      needs: needs || undefined,
      comments: comments || undefined,
      actions: actions.length > 0 ? actions : undefined,
    };

    onSave(updatedOKR);
    onClose();
  };

  return (
    <div className="changelog-overlay" onClick={handleOverlayClick}>
      <div className="checkin-modal">
        <div className="changelog-header">
          <div className="checkin-header-content">
            <h2>Check-in</h2>
            <span className="checkin-okr-title">{okr.objective}</span>
            {okr.area && <span className="checkin-area-badge">{okr.area}</span>}
          </div>
          <button className="changelog-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="checkin-content">
          {/* OKR Status (Global OKRs only) */}
          {!okr.parentId && (
            <div className="checkin-section">
              <h3>OKR Status</h3>
              <div className="checkin-input-group">
                <select
                  value={okrStatus || ''}
                  onChange={(e) => setOkrStatus((e.target.value || undefined) as OKRStatus | undefined)}
                >
                  <option value="">No Status</option>
                  <option value="on-track">On Track</option>
                  <option value="progressing">Progressing</option>
                  <option value="off-track">Off Track</option>
                </select>
              </div>
            </div>
          )}

          {/* Key Results Section */}
          <div className="checkin-section">
            <h3 className="checkin-section-toggle" onClick={() => setKrExpanded(!krExpanded)}>
              Key Results ({okr.keyResults.length})
              <span className="checkin-toggle-arrow">{krExpanded ? '⌃' : '⌄'}</span>
            </h3>
            {krExpanded && okr.keyResults.map(kr => {
              const data = keyResultsData[kr.id] || {};
              const progress = calculateProgress(kr.from, kr.to, data.current);
              const statusColor = getStatusColor(data.status);

              const isPercentage = (kr.unit ?? 'percentage') === 'percentage';
              return (
                <div key={kr.id} className="checkin-kr-card">
                  <div className="checkin-kr-header">
                    <span className="checkin-kr-metric">{kr.metricName}</span>
                    <span className="checkin-kr-target">{formatKRValue(kr.from, kr.unit)} → {formatKRValue(kr.to, kr.unit)}</span>
                  </div>

                  <div className="checkin-kr-inputs">
                    <div className="checkin-input-group">
                      <label>Current Value{isPercentage ? ' (%)' : ''}</label>
                      <input
                        type="number"
                        min={0}
                        max={isPercentage ? 100 : undefined}
                        value={data.current ?? ''}
                        onChange={(e) => handleCurrentChange(kr.id, e.target.value)}
                        placeholder={isPercentage ? 'Enter current %' : 'Enter current value'}
                      />
                    </div>

                    <div className="checkin-input-group">
                      <label>Status</label>
                      <select
                        value={data.status || ''}
                        onChange={(e) => handleStatusChange(kr.id, e.target.value as KeyResultStatus)}
                      >
                        <option value="">No Status</option>
                        <option value="on-track">On Track</option>
                        <option value="progressing">Progressing</option>
                        <option value="off-track">Off Track</option>
                      </select>
                    </div>
                  </div>

                  {data.current !== undefined && (
                    <div className="checkin-kr-progress">
                      <div className={`checkin-progress-track checkin-progress-${statusColor}`}>
                        <div
                          className="checkin-progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="checkin-progress-value">{progress}%</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions Section */}
          <div className="checkin-section checkin-actions-section" id="checkin-actions">
            <div className="checkin-actions-header">
              <h3>Actions</h3>
              {!showAddAction && (
                <button
                  className="checkin-add-action-btn"
                  onClick={() => setShowAddAction(true)}
                >
                  + Add Action
                </button>
              )}
            </div>

            {/* Add Action Form */}
            {showAddAction && (
              <div className="checkin-action-form">
                <input
                  type="text"
                  placeholder="Describe the action item..."
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  className="checkin-action-input"
                  autoFocus
                />
                <div className="checkin-action-form-row">
                  <select
                    value={newActionOwner}
                    onChange={(e) => setNewActionOwner(e.target.value)}
                    className="checkin-action-select"
                  >
                    <option value="">Select owner</option>
                    {PEOPLE.map(person => (
                      <option key={person} value={person}>{person}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={newActionDueDate}
                    onChange={(e) => setNewActionDueDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="checkin-action-date"
                  />
                </div>
                <div className="checkin-action-form-buttons">
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setShowAddAction(false);
                      setNewActionText('');
                      setNewActionOwner('');
                      setNewActionDueDate('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="submit-btn"
                    onClick={handleAddAction}
                    disabled={!newActionText.trim() || !newActionOwner || !newActionDueDate}
                  >
                    Add Action
                  </button>
                </div>
              </div>
            )}

            {/* Overdue Actions */}
            {overdueActions.length > 0 && (
              <div className="checkin-actions-group">
                <span className="checkin-actions-group-label overdue">OVERDUE</span>
                {overdueActions.map(action => (
                  <div key={action.id} className="checkin-action-card overdue">
                    <label className="checkin-action-checkbox">
                      <input
                        type="checkbox"
                        checked={action.completed}
                        onChange={() => handleToggleAction(action.id)}
                      />
                      <span className="checkin-action-text">{action.text}</span>
                    </label>
                    <div className="checkin-action-meta">
                      <span className="checkin-action-owner">{action.owner}</span>
                      <span className="checkin-action-separator">•</span>
                      <span className="checkin-action-due overdue">
                        Due: {formatDate(action.dueDate)} ({getDaysOverdue(action.dueDate)} days overdue)
                      </span>
                      <button
                        className="checkin-action-delete"
                        onClick={() => handleDeleteAction(action.id)}
                        title="Delete action"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Open Actions */}
            {openActions.length > 0 && (
              <div className="checkin-actions-group">
                <span className="checkin-actions-group-label">OPEN</span>
                {openActions.map(action => (
                  <div key={action.id} className="checkin-action-card">
                    <label className="checkin-action-checkbox">
                      <input
                        type="checkbox"
                        checked={action.completed}
                        onChange={() => handleToggleAction(action.id)}
                      />
                      <span className="checkin-action-text">{action.text}</span>
                    </label>
                    <div className="checkin-action-meta">
                      <span className="checkin-action-owner">{action.owner}</span>
                      <span className="checkin-action-separator">•</span>
                      <span className="checkin-action-due">Due: {formatDate(action.dueDate)}</span>
                      <button
                        className="checkin-action-delete"
                        onClick={() => handleDeleteAction(action.id)}
                        title="Delete action"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completed Actions */}
            {completedActions.length > 0 && (
              <div className="checkin-actions-group">
                <span className="checkin-actions-group-label completed">COMPLETED</span>
                {completedActions.map(action => (
                  <div key={action.id} className="checkin-action-card completed">
                    <label className="checkin-action-checkbox">
                      <input
                        type="checkbox"
                        checked={action.completed}
                        onChange={() => handleToggleAction(action.id)}
                      />
                      <span className="checkin-action-text">{action.text}</span>
                    </label>
                    <div className="checkin-action-meta">
                      <span className="checkin-action-owner">{action.owner}</span>
                      <span className="checkin-action-separator">•</span>
                      <span className="checkin-action-due">
                        Completed {action.completedAt ? formatDate(action.completedAt) : ''}
                      </span>
                      <button
                        className="checkin-action-delete"
                        onClick={() => handleDeleteAction(action.id)}
                        title="Delete action"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {actions.length === 0 && !showAddAction && (
              <p className="checkin-actions-empty">No actions yet. Click "+ Add Action" to create one.</p>
            )}
          </div>

          {/* Governance Fields */}
          <div className="checkin-section">
            <h3>What challenges are you facing?</h3>
            <textarea
              className="checkin-comments"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="Blockers, risks, or obstacles..."
              rows={3}
            />
          </div>

          <div className="checkin-section">
            <h3>What do you need to achieve your OKRs?</h3>
            <textarea
              className="checkin-comments"
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
              placeholder="Decisions, support, or resources needed..."
              rows={3}
            />
          </div>

          <div className="checkin-section">
            <h3>Comments</h3>
            <textarea
              className="checkin-comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
        </div>

        <div className="checkin-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="submit-btn" onClick={handleSave}>Save Check-in</button>
        </div>
      </div>
    </div>
  );
}
