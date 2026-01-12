import { useState, useEffect } from 'react';
import { OKR } from './types';
import { getOKRs, addOKR, deleteOKR, updateOKR } from './storage';
import { Sidebar } from './components/Sidebar';
import { NotionOKRList } from './components/NotionOKRList';
import { OKRForm } from './components/OKRForm';
import { OKRTreeView } from './components/OKRTreeView';
import { HelpButton } from './components/HelpButton';
import { HelpModal } from './components/HelpModal';
import './App.css';

type View = 'management' | 'tree';

function App() {
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOKR, setEditingOKR] = useState<OKR | null>(null);
  const [parentIdForNewOKR, setParentIdForNewOKR] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('management');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showChangelog, setShowChangelog] = useState(false);

  useEffect(() => {
    setOkrs(getOKRs());
  }, []);

  const handleCreateOKR = (okr: OKR) => {
    // For global OKRs (no parentId), auto-assign displayId
    if (!okr.parentId) {
      const globalOkrs = okrs.filter(o => !o.parentId && o.displayId);
      const maxNumber = globalOkrs.reduce((max, o) => {
        const match = o.displayId?.match(/OKR-(\d+)/);
        return match ? Math.max(max, parseInt(match[1], 10)) : max;
      }, 0);
      okr.displayId = `OKR-${maxNumber + 1}`;
    }
    addOKR(okr);
    setOkrs(getOKRs());
    setShowForm(false);
    setParentIdForNewOKR(null);
  };

  const handleUpdateOKR = (okr: OKR) => {
    updateOKR(okr);
    setOkrs(getOKRs());
    setEditingOKR(null);
  };

  const handleInlineUpdateOKR = (okr: OKR) => {
    updateOKR(okr);
    setOkrs(getOKRs());
  };

  const handleDeleteOKR = (id: string) => {
    deleteOKR(id);
    setOkrs(getOKRs());
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

  const renderContent = () => {
    const pageTitle = currentView === 'tree' ? 'OKR Tracking' : '2026 OKRs';
    const showNewButton = currentView === 'management' && !isFormVisible;

    return (
      <>
        <header className="notion-app-header">
          <h1>{pageTitle}</h1>
          {showNewButton && (
            <div className="notion-header-actions">
              <button className="notion-btn notion-btn-primary" onClick={() => setShowForm(true)}>
                + New
              </button>
            </div>
          )}
        </header>
        <main className="notion-app-main">
          {currentView === 'tree' ? (
            <OKRTreeView okrs={okrs} />
          ) : isFormVisible ? (
            <OKRForm
              onSubmit={editingOKR ? handleUpdateOKR : handleCreateOKR}
              onCancel={handleCancel}
              initialOKR={editingOKR ?? undefined}
              parentId={parentIdForNewOKR ?? undefined}
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
        onViewChange={setCurrentView}
      />
      <div className={`app-content ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
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
