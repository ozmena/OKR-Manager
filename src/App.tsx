import { useState, useEffect } from 'react';
import { OKR } from './types';
import { getOKRs, addOKR, deleteOKR, updateOKR } from './storage';
import { NotionOKRList } from './components/NotionOKRList';
import { OKRForm } from './components/OKRForm';
import { OKRTreeView } from './components/OKRTreeView';
import './App.css';

type View = 'management' | 'tree';

function App() {
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOKR, setEditingOKR] = useState<OKR | null>(null);
  const [parentIdForNewOKR, setParentIdForNewOKR] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('management');

  useEffect(() => {
    setOkrs(getOKRs());
  }, []);

  const handleCreateOKR = (okr: OKR) => {
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

  // For inline editing - doesn't affect form state
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

  const handleCancel = () => {
    setShowForm(false);
    setEditingOKR(null);
    setParentIdForNewOKR(null);
  };

  const isFormVisible = showForm || editingOKR !== null;

  if (currentView === 'tree') {
    return (
      <div className="notion-app">
        <OKRTreeView okrs={okrs} onBack={() => setCurrentView('management')} />
      </div>
    );
  }

  return (
    <div className="notion-app">
      <header className="notion-app-header">
        <h1>OKR Manager</h1>
        {!isFormVisible && (
          <div className="notion-header-actions">
            <button className="notion-btn notion-btn-secondary" onClick={() => setCurrentView('tree')}>
              🌳 Tree
            </button>
            <button className="notion-btn notion-btn-primary" onClick={() => setShowForm(true)}>
              + New
            </button>
          </div>
        )}
      </header>
      <main className="notion-app-main">
        {isFormVisible ? (
          <OKRForm
            onSubmit={editingOKR ? handleUpdateOKR : handleCreateOKR}
            onCancel={handleCancel}
            initialOKR={editingOKR ?? undefined}
            parentId={parentIdForNewOKR ?? undefined}
          />
        ) : (
          <NotionOKRList
            okrs={okrs}
            onEdit={handleEditOKR}
            onUpdate={handleInlineUpdateOKR}
            onDelete={handleDeleteOKR}
            onAddChild={handleAddChildOKR}
          />
        )}
      </main>
    </div>
  );
}

export default App;
