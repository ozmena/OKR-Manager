import { useState, useEffect, useCallback } from 'react';
import { OKR } from './types';
import { getOKRs as getLocalOKRs, addOKR as addLocalOKR, deleteOKR as deleteLocalOKR, updateOKR as updateLocalOKR } from './storage';
import {
  getOKRsFromSupabase,
  addOKRToSupabase,
  updateOKRInSupabase,
  deleteOKRFromSupabase,
  subscribeToOKRChanges,
  unsubscribeFromOKRChanges,
  isSupabaseConfigured,
} from './services/supabaseStorage';
import { Sidebar } from './components/Sidebar';
import { NotionOKRList } from './components/NotionOKRList';
import { OKRForm } from './components/OKRForm';
import { OKRTreeView } from './components/OKRTreeView';
import { HelpButton } from './components/HelpButton';
import { HelpModal } from './components/HelpModal';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { captureEvent, capturePageView } from './lib/posthog';
import './App.css';

type View = 'management' | 'tree' | 'dashboards' | 'users';
type TreeViewMode = 'tracking' | 'setting';

function viewToPath(view: View, mode?: TreeViewMode, filter?: string | null): string {
  if (view === 'tree') return mode === 'tracking' ? '/okr-map?mode=tracking' : '/okr-map';
  if (view === 'management') return '/okr-list';
  if (view === 'users') return '/users';
  return filter ? `/?filter=${filter}` : '/';
}

function pathToView(): { view: View; mode: TreeViewMode; filter: string | null } {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  if (path.startsWith('/okr-map')) return { view: 'tree', mode: params.get('mode') === 'tracking' ? 'tracking' : 'setting', filter: null };
  if (path === '/okr-list') return { view: 'management', mode: 'setting', filter: null };
  if (path === '/users') return { view: 'users', mode: 'setting', filter: null };
  return { view: 'dashboards', mode: 'setting', filter: params.get('filter') };
}

function App() {
  const initial = pathToView();
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOKR, setEditingOKR] = useState<OKR | null>(null);
  const [parentIdForNewOKR, setParentIdForNewOKR] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>(initial.view);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showChangelog, setShowChangelog] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [treeViewMode, setTreeViewMode] = useState<TreeViewMode>(initial.mode);
  const [pendingOkrId, setPendingOkrId] = useState<string | null>(null);
  const [pendingCheckInOkrId, setPendingCheckInOkrId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useSupabase] = useState(isSupabaseConfigured());
  const [dashboardFilter, setDashboardFilter] = useState<string | null>(initial.filter);

  // Navigate to a view and push browser history
  const navigateTo = useCallback((view: View, mode?: TreeViewMode) => {
    const resolvedMode = mode ?? (view === 'tree' ? treeViewMode : 'setting');
    setCurrentView(view);
    if (view === 'tree' && mode) setTreeViewMode(mode);
    window.history.pushState(null, '', viewToPath(view, resolvedMode, view === 'dashboards' ? dashboardFilter : null));
  }, [treeViewMode, dashboardFilter]);

  // Update dashboard filter and sync URL (replaceState, not pushState)
  const handleDashboardFilterChange = useCallback((filter: string | null) => {
    setDashboardFilter(filter);
    window.history.replaceState(null, '', viewToPath('dashboards', undefined, filter));
  }, []);

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const { view, mode, filter } = pathToView();
      setCurrentView(view);
      setTreeViewMode(mode);
      setDashboardFilter(filter);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Track page view when view changes
  useEffect(() => {
    capturePageView(currentView);
  }, [currentView]);

  // Load OKRs from Supabase or localStorage
  const loadOKRs = useCallback(async () => {
    if (useSupabase) {
      try {
        const data = await getOKRsFromSupabase();
        setOkrs(data);
        setError(null);
      } catch (err) {
        console.error('Error loading from Supabase:', err);
        setError('Failed to load OKRs from database. Using local data.');
        setOkrs(getLocalOKRs());
      }
    } else {
      setOkrs(getLocalOKRs());
    }
    setIsLoading(false);
  }, [useSupabase]);

  // Initial load and real-time subscription
  useEffect(() => {
    loadOKRs();

    // Set up real-time subscription if using Supabase
    const channel = useSupabase ? subscribeToOKRChanges(loadOKRs) : null;

    return () => {
      if (channel) {
        unsubscribeFromOKRChanges(channel);
      }
    };
  }, [loadOKRs, useSupabase]);

  const handleCreateOKR = async (okr: OKR) => {
    // For global OKRs (no parentId), auto-assign displayId
    if (!okr.parentId) {
      const globalOkrs = okrs.filter(o => !o.parentId && o.displayId);
      const maxNumber = globalOkrs.reduce((max, o) => {
        const match = o.displayId?.match(/OKR-(\d+)/);
        return match ? Math.max(max, parseInt(match[1], 10)) : max;
      }, 0);
      okr.displayId = `OKR-${maxNumber + 1}`;
    }

    if (useSupabase) {
      try {
        await addOKRToSupabase(okr);
        await loadOKRs(); // Refresh data from Supabase
      } catch (err) {
        console.error('Error creating OKR in Supabase:', err);
        setError('Failed to save. Saving locally instead.');
        addLocalOKR(okr);
        setOkrs(getLocalOKRs());
      }
    } else {
      addLocalOKR(okr);
      setOkrs(getLocalOKRs());
    }
    captureEvent('okr_created', { type: okr.parentId ? 'child' : 'global', okr_id: okr.displayId || okr.id });
    setShowForm(false);
    setParentIdForNewOKR(null);
  };

  const handleUpdateOKR = async (okr: OKR) => {
    if (useSupabase) {
      try {
        await updateOKRInSupabase(okr);
        await loadOKRs(); // Refresh data from Supabase
      } catch (err) {
        console.error('Error updating OKR in Supabase:', err);
        setError('Failed to save. Saving locally instead.');
        updateLocalOKR(okr);
        setOkrs(getLocalOKRs());
      }
    } else {
      updateLocalOKR(okr);
      setOkrs(getLocalOKRs());
    }
    captureEvent('okr_updated', { okr_id: okr.displayId || okr.id, source: 'form' });
    setEditingOKR(null);
  };

  const handleInlineUpdateOKR = async (okr: OKR) => {
    if (useSupabase) {
      try {
        await updateOKRInSupabase(okr);
        await loadOKRs(); // Refresh data from Supabase
      } catch (err) {
        console.error('Error updating OKR in Supabase:', err);
        updateLocalOKR(okr);
        setOkrs(getLocalOKRs());
      }
    } else {
      updateLocalOKR(okr);
      setOkrs(getLocalOKRs());
    }
  };

  const handleDeleteOKR = async (id: string) => {
    captureEvent('okr_deleted', { okr_id: id });
    if (useSupabase) {
      try {
        await deleteOKRFromSupabase(id);
        await loadOKRs(); // Refresh data from Supabase
      } catch (err) {
        console.error('Error deleting OKR in Supabase:', err);
        setError('Failed to delete. Deleting locally instead.');
        deleteLocalOKR(id);
        setOkrs(getLocalOKRs());
      }
    } else {
      deleteLocalOKR(id);
      setOkrs(getLocalOKRs());
    }
  };

  const handleEditOKR = (okr: OKR) => {
    setEditingOKR(okr);
  };

  const handleAddChildOKR = (parentId: string) => {
    setParentIdForNewOKR(parentId);
    setShowForm(true);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingOKR(null);
    setParentIdForNewOKR(null);
  };

  const isFormVisible = showForm || editingOKR !== null;

  const handleDashboardOkrClick = (okrId: string) => {
    setPendingOkrId(okrId);
    navigateTo('tree', 'tracking');
  };

  const handleDashboardActionClick = (globalOkrId: string, areaOkrId: string) => {
    setPendingOkrId(globalOkrId);
    setPendingCheckInOkrId(areaOkrId);
    navigateTo('tree', 'tracking');
  };

  const renderContent = () => {
    // Loading state
    if (isLoading) {
      return (
        <div className="loading-state">
          <p>Loading OKRs...</p>
        </div>
      );
    }

    // Executive Dashboard
    if (currentView === 'dashboards') {
      return <ExecutiveDashboard okrs={okrs} onNavigate={navigateTo} onOkrClick={handleDashboardOkrClick} onActionClick={handleDashboardActionClick} activeFilter={dashboardFilter} onFilterChange={handleDashboardFilterChange} />;
    }

    // Users coming soon page
    if (currentView === 'users') {
      return (
        <div className="coming-soon-page">
          <p>Coming soon. We are cooking up something great for you.</p>
        </div>
      );
    }

    const pageTitle = currentView === 'tree' ? 'OKR Map' : 'OKR List';
    const showNewButton = currentView === 'management' && !isFormVisible;

    return (
      <>
        <header className="notion-app-header">
          <h1>{pageTitle}</h1>
          {currentView === 'tree' && (
            <div className={`mode-switch ${treeViewMode === 'tracking' ? 'tracking' : 'setting'}`}>
              <button
                className={`mode-switch-option ${treeViewMode === 'setting' ? 'active' : ''}`}
                onClick={() => { const next: TreeViewMode = treeViewMode === 'setting' ? 'tracking' : 'setting'; navigateTo('tree', next); captureEvent('mode_switched', { mode: next }); }}
              >
                OKR Setting
              </button>
              <button
                className={`mode-switch-option ${treeViewMode === 'tracking' ? 'active' : ''}`}
                onClick={() => { const next: TreeViewMode = treeViewMode === 'tracking' ? 'setting' : 'tracking'; navigateTo('tree', next); captureEvent('mode_switched', { mode: next }); }}
              >
                OKR Tracking
              </button>
            </div>
          )}
          {currentView !== 'tree' && <div className="notion-header-spacer"></div>}
          {showNewButton && (
            <div className="notion-page-header-actions">
              <div className="notion-search-container">
                <input
                  type="text"
                  className="notion-search-input"
                  placeholder="Search OKRs, Areas, Owners.."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="notion-search-clear" onClick={() => setSearchQuery('')}>
                    ×
                  </button>
                )}
              </div>
              <button className="notion-btn notion-btn-primary" onClick={() => setShowForm(true)}>
                + New OKR
              </button>
            </div>
          )}
        </header>
        <main className="notion-app-main">
          {currentView === 'tree' ? (
            <OKRTreeView okrs={okrs} onUpdateOKR={handleInlineUpdateOKR} mode={treeViewMode} initialSelectedOkrId={pendingOkrId} onInitialOkrConsumed={() => setPendingOkrId(null)} initialCheckInOkrId={pendingCheckInOkrId} onInitialCheckInConsumed={() => setPendingCheckInOkrId(null)} />
          ) : isFormVisible ? (
            <OKRForm
              onSubmit={editingOKR ? handleUpdateOKR : handleCreateOKR}
              onCancel={handleCancel}
              initialOKR={editingOKR ?? undefined}
              parentId={parentIdForNewOKR ?? undefined}
              parentOKR={
                parentIdForNewOKR
                  ? okrs.find(o => o.id === parentIdForNewOKR)
                  : editingOKR?.parentId
                    ? okrs.find(o => o.id === editingOKR.parentId)
                    : undefined
              }
            />
          ) : (
            <NotionOKRList
              okrs={okrs}
              expandedIds={expandedIds}
              onToggleExpand={handleToggleExpand}
              onEdit={handleEditOKR}
              onUpdate={handleInlineUpdateOKR}
              onDelete={handleDeleteOKR}
              onAddChild={handleAddChildOKR}
              searchQuery={searchQuery}
            />
          )}
        </main>
      </>
    );
  };

  return (
    <div className="app-layout">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentView={currentView}
        onViewChange={navigateTo}
      />
      <div className={`app-content ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
        <div className="notion-app">
          {renderContent()}
        </div>
      </div>
      <HelpButton onClick={() => setShowChangelog(true)} />
      <HelpModal isOpen={showChangelog} onClose={() => setShowChangelog(false)} />
    </div>
  );
}

export default App;
