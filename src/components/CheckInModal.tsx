import { useState, useEffect } from 'react';
import { OKR, KeyResult, KeyResultStatus } from '../types';

interface CheckInModalProps {
  isOpen: boolean;
  okr: OKR | null;
  onClose: () => void;
  onSave: (updatedOKR: OKR) => void;
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

export function CheckInModal({ isOpen, okr, onClose, onSave }: CheckInModalProps) {
  const [keyResultsData, setKeyResultsData] = useState<Record<string, KeyResultFormData>>({});
  const [comments, setComments] = useState('');

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
      setComments(okr.comments || '');
    }
  }, [okr]);

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

  const handleSave = () => {
    const updatedKeyResults: KeyResult[] = okr.keyResults.map(kr => ({
      ...kr,
      current: keyResultsData[kr.id]?.current,
      status: keyResultsData[kr.id]?.status || undefined,
    }));

    const updatedOKR: OKR = {
      ...okr,
      keyResults: updatedKeyResults,
      comments: comments || undefined,
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
          {/* Key Results Section */}
          <div className="checkin-section">
            <h3>Key Results</h3>
            {okr.keyResults.map(kr => {
              const data = keyResultsData[kr.id] || {};
              const progress = calculateProgress(kr.from, kr.to, data.current);
              const statusColor = getStatusColor(data.status);

              return (
                <div key={kr.id} className="checkin-kr-card">
                  <div className="checkin-kr-header">
                    <span className="checkin-kr-metric">{kr.metricName}</span>
                    <span className="checkin-kr-target">{kr.from}% → {kr.to}%</span>
                  </div>

                  <div className="checkin-kr-inputs">
                    <div className="checkin-input-group">
                      <label>Current Value (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={data.current ?? ''}
                        onChange={(e) => handleCurrentChange(kr.id, e.target.value)}
                        placeholder="Enter current %"
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

          {/* Comments Section */}
          <div className="checkin-section">
            <h3>Comments</h3>
            <textarea
              className="checkin-comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add notes about this check-in..."
              rows={4}
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
