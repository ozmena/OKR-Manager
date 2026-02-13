import { useState } from 'react';
import { OKR, KeyResult, AREAS, PEOPLE, QUALITY_CHECKLIST_ITEMS } from '../types';
import { KeyResultInput } from './KeyResultInput';
import { AIFeedbackModal } from './AIFeedbackModal';
import { getAIFeedback } from '../services/aiService';

// Helper component for tooltip
const HelpTooltip = ({ text }: { text: string }) => (
  <span className="help-tooltip">
    <span className="help-tooltip-icon">?</span>
    <span className="help-tooltip-text">{text}</span>
  </span>
);

interface OKRFormProps {
  onSubmit: (okr: OKR) => void;
  onCancel: () => void;
  initialOKR?: OKR;
  parentId?: string;
  parentOKR?: OKR;
}

function createEmptyKeyResult(): KeyResult {
  return {
    id: crypto.randomUUID(),
    metricName: '',
    from: 0,
    to: 0,
    unit: 'percentage',
  };
}

export function OKRForm({ onSubmit, onCancel, initialOKR, parentId, parentOKR }: OKRFormProps) {
  const isEditing = !!initialOKR;
  const isAddingChild = !!parentId;
  const isChildOKR = isAddingChild || !!initialOKR?.parentId;
  const [objective, setObjective] = useState(initialOKR?.objective ?? '');
  const [area, setArea] = useState(initialOKR?.area ?? '');
  const [owner, setOwner] = useState(initialOKR?.owner ?? '');
  const [keyResults, setKeyResults] = useState<KeyResult[]>(
    initialOKR?.keyResults ?? [createEmptyKeyResult()]
  );
  const [error, setError] = useState('');

  // AI Feedback state
  const [showAIFeedback, setShowAIFeedback] = useState(false);
  const [aiFeedback, setAIFeedback] = useState<string | null>(null);
  const [aiLoading, setAILoading] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);

  // Quality checklist state (only for Area OKRs)
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    QUALITY_CHECKLIST_ITEMS.forEach(item => {
      const existing = initialOKR?.qualityChecklist?.find(c => c.id === item.id);
      initial[item.id] = existing?.checked ?? false;
    });
    return initial;
  });
  const [checklistExpanded, setChecklistExpanded] = useState(false);

  const checkedCount = Object.values(checklistState).filter(Boolean).length;

  const handleGetAIFeedback = async () => {
    setShowAIFeedback(true);
    setAILoading(true);
    setAIError(null);
    setAIFeedback(null);

    const okrData = {
      objective: objective.trim(),
      area: area || undefined,
      keyResults: keyResults
        .filter(kr => kr.metricName.trim())
        .map(kr => ({
          metricName: kr.metricName,
          from: kr.from,
          to: kr.to,
          unit: kr.unit
        }))
    };

    const result = await getAIFeedback(okrData, parentOKR);

    setAILoading(false);
    if (result.success) {
      setAIFeedback(result.feedback || null);
    } else {
      setAIError(result.error || 'Unknown error');
    }
  };

  const handleKeyResultChange = (index: number, field: keyof KeyResult, value: string | number) => {
    const updated = [...keyResults];
    updated[index] = { ...updated[index], [field]: value };
    setKeyResults(updated);
  };

  const handleAddKeyResult = () => {
    if (keyResults.length < 3) {
      setKeyResults([...keyResults, createEmptyKeyResult()]);
    }
  };

  const handleRemoveKeyResult = (index: number) => {
    setKeyResults(keyResults.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!objective.trim()) {
      setError('Please enter an objective statement.');
      return;
    }

    if (isChildOKR && !area) {
      setError('Please select an area for this Area OKR.');
      return;
    }

    const validKeyResults = keyResults.filter(kr => kr.metricName.trim());
    if (validKeyResults.length === 0) {
      setError('Please add at least one key result with a metric name.');
      return;
    }

    const okr: OKR = {
      id: initialOKR?.id ?? crypto.randomUUID(),
      displayId: initialOKR?.displayId,
      objective: objective.trim(),
      keyResults: validKeyResults,
      createdAt: initialOKR?.createdAt ?? new Date().toISOString(),
      parentId: initialOKR?.parentId ?? parentId,
      ...(isChildOKR && { area }),
      ...(owner && { owner }),
      ...(isChildOKR && {
        qualityChecklist: QUALITY_CHECKLIST_ITEMS.map(item => ({
          id: item.id,
          checked: checklistState[item.id]
        }))
      }),
    };

    onSubmit(okr);
  };

  return (
    <form className="okr-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? (isChildOKR ? 'Edit Area OKR' : 'Edit OKR') : isAddingChild ? 'Add Area OKR' : 'Create New OKR'}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="field">
        <div className="field-label-row">
          <label>
            Objective Statement
            {isChildOKR && (
              <HelpTooltip text="What meaningful change can your area create that helps move the global OKR forward?" />
            )}
          </label>
          <button
            type="button"
            className="tree-card-ai-btn tree-card-ai-btn--purple"
            title="Get AI feedback on this OKR"
            onClick={handleGetAIFeedback}
          >
            ✨
          </button>
        </div>
        <textarea
          placeholder="Enter your objective..."
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          rows={3}
        />
      </div>

      {isChildOKR && (
        <div className="field">
          <label>Area</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="area-select"
          >
            <option value="">Select an area...</option>
            {AREAS.map((areaOption) => (
              <option key={areaOption} value={areaOption}>
                {areaOption}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="field">
        <label>Owner</label>
        <select
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="owner-select"
        >
          <option value="">No owner</option>
          {PEOPLE.map((person) => (
            <option key={person} value={person}>
              {person}
            </option>
          ))}
        </select>
      </div>

      <div className="key-results-section">
        <h3>
          Key Results (up to 3)
          {isChildOKR && (
            <HelpTooltip text="How will we know we're making progress toward that objective?" />
          )}
        </h3>
        {keyResults.map((kr, index) => (
          <KeyResultInput
            key={kr.id}
            keyResult={kr}
            index={index}
            onChange={handleKeyResultChange}
            onRemove={handleRemoveKeyResult}
            canRemove={keyResults.length > 1}
            isAreaOKR={isChildOKR}
          />
        ))}
        {keyResults.length < 3 && (
          <button type="button" className="add-kr-btn" onClick={handleAddKeyResult}>
            + Add Key Result
          </button>
        )}
      </div>

      {isChildOKR && (
        <div className="quality-checklist">
          <button
            type="button"
            className="quality-checklist-header"
            onClick={() => setChecklistExpanded(!checklistExpanded)}
          >
            <span className="quality-checklist-toggle">{checklistExpanded ? '▼' : '▶'}</span>
            <span className="quality-checklist-title">OKR Quality Checklist</span>
            <span className={`quality-checklist-progress ${checkedCount >= 7 ? 'quality-badge-high' : ''}`}>{checkedCount}/{QUALITY_CHECKLIST_ITEMS.length}</span>
          </button>
          {checklistExpanded && (
            <div className="quality-checklist-items">
              {QUALITY_CHECKLIST_ITEMS.map((item) => (
                <label key={item.id} className="quality-checklist-item">
                  <input
                    type="checkbox"
                    checked={checklistState[item.id]}
                    onChange={(e) => setChecklistState(prev => ({
                      ...prev,
                      [item.id]: e.target.checked
                    }))}
                  />
                  <span className="quality-checklist-item-content">
                    <span className="quality-checklist-item-title">{item.title}</span>
                    <span className="quality-checklist-item-question">{item.question}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <AIFeedbackModal
        isOpen={showAIFeedback}
        onClose={() => setShowAIFeedback(false)}
        feedback={aiFeedback}
        isLoading={aiLoading}
        error={aiError}
      />

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="submit-btn">
          {isEditing ? (isChildOKR ? 'Update Area OKR' : 'Update OKR') : (isAddingChild ? 'Create Area OKR' : 'Create OKR')}
        </button>
      </div>
    </form>
  );
}
