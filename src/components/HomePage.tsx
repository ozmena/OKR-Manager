import { OKR } from '../types';

interface HomePageProps {
  okrs: OKR[];
  onNavigate: (view: 'management' | 'tree') => void;
}

export function HomePage({ okrs, onNavigate }: HomePageProps) {
  // Calculate stats
  const globalOkrCount = okrs.filter(o => !o.parentId).length;
  const totalKeyResults = okrs.reduce((sum, o) => sum + o.keyResults.length, 0);

  // Calculate on-track percentage (only count KRs that have a status)
  const krsWithStatus = okrs.flatMap(o => o.keyResults).filter(kr => kr.status);
  const onTrackCount = krsWithStatus.filter(kr => kr.status === 'on-track').length;
  const onTrackPercentage = krsWithStatus.length > 0
    ? Math.round((onTrackCount / krsWithStatus.length) * 100)
    : 0;

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Logo */}
        <div className="home-logo">
          <span className="home-logo-text">Vector</span>
          <span className="home-logo-arrow">↗</span>
        </div>

        {/* Tagline */}
        <h1 className="home-tagline">Dream. Align. Achieve.</h1>

        {/* Description */}
        <p className="home-description">
          Vector helps enterprises create, cascade, and track
          OKRs so every team moves in the same direction.
        </p>

        {/* Stats section */}
        <section className="home-stats">
          <div className="home-stat-card">
            <span className="home-stat-value">{globalOkrCount}</span>
            <span className="home-stat-label">Global OKRs</span>
          </div>
          <div className="home-stat-card">
            <span className="home-stat-value">{totalKeyResults}</span>
            <span className="home-stat-label">Key Results</span>
          </div>
          <div className="home-stat-card">
            <span className="home-stat-value">{onTrackPercentage}%</span>
            <span className="home-stat-label">On Track</span>
          </div>
        </section>

        {/* Action buttons */}
        <div className="home-actions">
          <button className="home-btn-primary" onClick={() => onNavigate('management')}>
            Manage OKRs
          </button>
          <button className="home-btn-secondary" onClick={() => onNavigate('tree')}>
            Track Progress
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        Powered by Vector v1.0
      </footer>
    </div>
  );
}
