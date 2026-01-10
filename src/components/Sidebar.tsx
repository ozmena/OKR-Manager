interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentView: 'management' | 'tree';
  onViewChange: (view: 'management' | 'tree') => void;
}

export function Sidebar({ isCollapsed, onToggle, currentView, onViewChange }: SidebarProps) {
  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <button className="sidebar-title" onClick={() => onViewChange('management')}>
            Vector ↗
          </button>
        )}
        <button className="sidebar-toggle" onClick={onToggle} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {isCollapsed ? '»' : '«'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-item ${currentView === 'management' ? 'active' : ''}`}
          onClick={() => onViewChange('management')}
          title="2026 OKRs"
        >
          <span className="sidebar-icon">◎</span>
          {!isCollapsed && <span className="sidebar-label">2026 OKRs</span>}
        </button>
        <button
          className={`sidebar-item ${currentView === 'tree' ? 'active' : ''}`}
          onClick={() => onViewChange('tree')}
          title="OKR Tracking"
        >
          <span className="sidebar-icon">🌲</span>
          {!isCollapsed && <span className="sidebar-label">OKR Tracking</span>}
        </button>
      </nav>
    </aside>
  );
}
