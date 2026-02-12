interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentView: 'management' | 'tree' | 'dashboards' | 'users';
  onViewChange: (view: 'management' | 'tree' | 'dashboards' | 'users') => void;
}

export function Sidebar({ isCollapsed, onToggle, currentView, onViewChange }: SidebarProps) {
  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <button className="sidebar-title" onClick={() => onViewChange('dashboards')}>
            Vector<span className="sidebar-arrow">↗</span>
          </button>
        )}
        <button className="sidebar-toggle" onClick={onToggle} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {isCollapsed ? '»' : '«'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-item ${currentView === 'dashboards' ? 'active' : ''}`}
          onClick={() => onViewChange('dashboards')}
          title="Dashboards"
        >
          <span className="sidebar-icon"><img src="/icons/icon-dashboard.png" alt="" width="32" height="32" /></span>
          {!isCollapsed && (
            <>
              <span className="sidebar-label">Dashboard</span>
              <span className="sidebar-tag sidebar-tag-new">New</span>
            </>
          )}
        </button>
        <button
          className={`sidebar-item ${currentView === 'management' ? 'active' : ''}`}
          onClick={() => onViewChange('management')}
          title="OKR List"
        >
          <span className="sidebar-icon"><img src="/icons/icon-list.png" alt="" width="32" height="32" /></span>
          {!isCollapsed && <span className="sidebar-label">OKR List</span>}
        </button>
        <button
          className={`sidebar-item ${currentView === 'tree' ? 'active' : ''}`}
          onClick={() => onViewChange('tree')}
          title="OKR Map"
        >
          <span className="sidebar-icon"><img src="/icons/icon-map.png" alt="" width="32" height="32" /></span>
          {!isCollapsed && <span className="sidebar-label">OKR Map</span>}
        </button>
        <button
          className={`sidebar-item ${currentView === 'users' ? 'active' : ''}`}
          onClick={() => onViewChange('users')}
          title="Users"
        >
          <span className="sidebar-icon"><img src="/icons/icon-user.png" alt="" width="32" height="32" /></span>
          {!isCollapsed && (
            <>
              <span className="sidebar-label">Users</span>
              <span className="sidebar-tag sidebar-tag-soon">Soon</span>
            </>
          )}
        </button>
      </nav>

      {/* Company logo footer */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="sidebar-logo-container">
            <img
              src="/kraft-heinz-logo.png"
              alt="Kraft Heinz"
              className="sidebar-logo"
            />
          </div>
        )}
      </div>
    </aside>
  );
}
