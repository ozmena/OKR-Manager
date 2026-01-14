interface AIFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: string | null;
  isLoading: boolean;
  error: string | null;
}

export function AIFeedbackModal({ isOpen, onClose, feedback, isLoading, error }: AIFeedbackModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Convert markdown-style formatting to HTML
  const formatFeedback = (text: string): string => {
    return text
      // Bold text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Line breaks
      .replace(/\n/g, '<br />')
      // Lists (basic)
      .replace(/- /g, '• ');
  };

  return (
    <div className="changelog-overlay" onClick={handleOverlayClick}>
      <div className="ai-feedback-modal">
        <div className="changelog-header">
          <div className="ai-feedback-header-content">
            <span className="ai-feedback-icon">✨</span>
            <h2>AI Feedback</h2>
          </div>
          <button className="changelog-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="ai-feedback-content">
          {isLoading && (
            <div className="ai-feedback-loading">
              <div className="ai-feedback-spinner"></div>
              <p>Analyzing your OKR...</p>
            </div>
          )}

          {error && (
            <div className="ai-feedback-error">
              <p><strong>Error:</strong> {error}</p>
              <p className="ai-feedback-error-hint">
                Make sure you have set VITE_ANTHROPIC_API_KEY in your .env file.
              </p>
            </div>
          )}

          {feedback && !isLoading && !error && (
            <div
              className="ai-feedback-text"
              dangerouslySetInnerHTML={{ __html: formatFeedback(feedback) }}
            />
          )}
        </div>

        <div className="ai-feedback-footer">
          <button className="submit-btn" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
