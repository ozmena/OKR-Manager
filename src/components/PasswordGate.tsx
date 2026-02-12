import { useState, useEffect } from 'react';
import './PasswordGate.css';

interface PasswordGateProps {
  children: React.ReactNode;
}

const SITE_PASSWORD = import.meta.env.VITE_SITE_PASSWORD;
const SESSION_KEY = 'okr_authenticated';

export function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    // Check if already authenticated in this session
    const authenticated = sessionStorage.getItem(SESSION_KEY);
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
    // If no password is set, allow access (for local development)
    if (!SITE_PASSWORD) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === SITE_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsAuthenticated(true);
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (isLoading) {
    return (
      <div className="password-gate">
        <div className="password-gate-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="password-gate">
      <div className="password-gate-topbar">
        <div className="password-gate-logo">
          <span className="password-gate-logo-text">Vector</span>
          <span className="password-gate-logo-arrow">↗</span>
        </div>
        <button className="password-gate-about-btn" onClick={() => setShowAbout(true)}>About</button>
      </div>

      <div className="password-gate-hero">
        <h1 className="password-gate-tagline">
          Track your OKRs <em>without the friction</em>
        </h1>

        <p className="password-gate-description">
          Dream. Align. Achieve.
        </p>

        <p className="password-gate-subtitle">An OKR platform for enterprise leaders.</p>

        <div className="password-gate-card">
          <h2 className="password-gate-card-label">Demo Access</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your access code"
              autoFocus
              className={error ? 'error' : ''}
            />
            {error && <p className="password-gate-error">{error}</p>}
            <button type="submit">Continue</button>
          </form>
        </div>
      </div>

      <footer className="password-gate-footer">
        Vector V0.8 by Open Change B.V.
      </footer>

      {showAbout && (
        <div className="password-gate-modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="password-gate-modal" onClick={(e) => e.stopPropagation()}>
            <div className="password-gate-modal-brand">
              <span className="password-gate-modal-logo">Vector</span>
              <span className="password-gate-modal-logo-arrow">↗</span>
            </div>
            <p className="password-gate-modal-tagline">Dream. Align. Achieve.</p>
            <div className="password-gate-modal-divider" />
            <p className="password-gate-modal-text">
              OKRs are simple and powerful, but somehow, most tools make them complicated. We believe it should be the other way around. Vector makes OKRs easy to set, fun to track, and clear enough to act on.
            </p>
            <p className="password-gate-modal-text">
              When the energy of an entire organization flows toward the same goals, that's when real magic happens.
            </p>
            <p className="password-gate-modal-signoff">Designed with love by Open Change in the Netherlands 🇳🇱</p>
            <button className="password-gate-modal-close-btn" onClick={() => setShowAbout(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
