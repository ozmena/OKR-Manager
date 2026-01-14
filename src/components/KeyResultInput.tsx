import { KeyResult, KeyResultUnit } from '../types';

interface KeyResultInputProps {
  keyResult: KeyResult;
  index: number;
  onChange: (index: number, field: keyof KeyResult, value: string | number) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function KeyResultInput({ keyResult, index, onChange, onRemove, canRemove }: KeyResultInputProps) {
  const unit = keyResult.unit ?? 'percentage';
  const isPercentage = unit === 'percentage';

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
        <div className="field-row">
          <div className="field" style={{ flex: 2 }}>
            <label>Metric Name</label>
            <input
              type="text"
              placeholder="e.g., Market share"
              value={keyResult.metricName}
              onChange={(e) => onChange(index, 'metricName', e.target.value)}
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Unit</label>
            <select
              value={unit}
              onChange={(e) => onChange(index, 'unit', e.target.value as KeyResultUnit)}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="number">Number</option>
            </select>
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>From{isPercentage ? ' (%)' : ''}</label>
            <input
              type="number"
              min="0"
              max={isPercentage ? 100 : undefined}
              placeholder={isPercentage ? '0' : 'Start value'}
              value={keyResult.from || ''}
              onChange={(e) => onChange(index, 'from', Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label>To{isPercentage ? ' (%)' : ''}</label>
            <input
              type="number"
              min="0"
              max={isPercentage ? 100 : undefined}
              placeholder={isPercentage ? '100' : 'Target value'}
              value={keyResult.to || ''}
              onChange={(e) => onChange(index, 'to', Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
