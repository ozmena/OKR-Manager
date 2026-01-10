import { KeyResult } from '../types';

interface KeyResultInputProps {
  keyResult: KeyResult;
  index: number;
  onChange: (index: number, field: keyof KeyResult, value: string | number) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function KeyResultInput({ keyResult, index, onChange, onRemove, canRemove }: KeyResultInputProps) {
  return (
    <div className="key-result-input">
      <div className="key-result-header">
        <span className="key-result-label">Key Result {index + 1}</span>
        {canRemove && (
          <button type="button" className="remove-btn" onClick={() => onRemove(index)}>
            Remove
          </button>
        )}
      </div>
      <div className="key-result-fields">
        <div className="field">
          <label>Metric Name</label>
          <input
            type="text"
            placeholder="e.g., Market share"
            value={keyResult.metricName}
            onChange={(e) => onChange(index, 'metricName', e.target.value)}
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label>From (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="0"
              value={keyResult.from || ''}
              onChange={(e) => onChange(index, 'from', Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label>To (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="100"
              value={keyResult.to || ''}
              onChange={(e) => onChange(index, 'to', Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
