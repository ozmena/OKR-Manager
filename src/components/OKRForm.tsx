import { useState } from 'react';
import { OKR, KeyResult, AREAS } from '../types';
import { KeyResultInput } from './KeyResultInput';

interface OKRFormProps {
  onSubmit: (okr: OKR) => void;
  onCancel: () => void;
  initialOKR?: OKR;
  parentId?: string;
}

function createEmptyKeyResult(): KeyResult {
  return {
    id: crypto.randomUUID(),
    metricName: '',
    from: 0,
    to: 0,
  };
}

export function OKRForm({ onSubmit, onCancel, initialOKR, parentId }: OKRFormProps) {
  const isEditing = !!initialOKR;
  const isAddingChild = !!parentId;
  const isChildOKR = isAddingChild || !!initialOKR?.parentId;
  const [objective, setObjective] = useState(initialOKR?.objective ?? '');
  const [area, setArea] = useState(initialOKR?.area ?? '');
  const [keyResults, setKeyResults] = useState<KeyResult[]>(
    initialOKR?.keyResults ?? [createEmptyKeyResult()]
  );
  const [error, setError] = useState('');

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
    };

    onSubmit(okr);
  };

  return (
    <form className="okr-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? (isChildOKR ? 'Edit Area OKR' : 'Edit OKR') : isAddingChild ? 'Add Area OKR' : 'Create New OKR'}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="field">
        <label>Objective Statement</label>
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

      <div className="key-results-section">
        <h3>Key Results (up to 3)</h3>
        {keyResults.map((kr, index) => (
          <KeyResultInput
            key={kr.id}
            keyResult={kr}
            index={index}
            onChange={handleKeyResultChange}
            onRemove={handleRemoveKeyResult}
            canRemove={keyResults.length > 1}
          />
        ))}
        {keyResults.length < 3 && (
          <button type="button" className="add-kr-btn" onClick={handleAddKeyResult}>
            + Add Key Result
          </button>
        )}
      </div>

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
