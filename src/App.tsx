import { useState } from 'react';
import { Header } from './components/Header';
import { TenderList } from './components/TenderList';
import { ChatPanel } from './components/ChatPanel';
import { TenderModal } from './components/TenderModal';
import { useTenders } from './hooks/useTenders';
import { useSelectedTenders } from './hooks/useSelectedTenders';
import { useChat } from './hooks/useChat';
import './App.css';

type ActiveFilter = 'all' | 'active' | 'inactive';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>(null);

  // Convert filter to is_active parameter
  const isActiveParam =
    activeFilter === 'all' ? undefined : activeFilter === 'active' ? true : false;

  const { tenders, loading, hasMore, loadMoreTenders } = useTenders(
    searchQuery,
    isActiveParam
  );
  const { selectedIds, selectedCount, toggleTender, clearSelection, selectOnly } =
    useSelectedTenders();
  const chatState = useChat(Array.from(selectedIds));

  const handleCardClick = (id: string) => {
    setSelectedTenderId(id);
  };

  const handleCloseModal = () => {
    setSelectedTenderId(null);
  };

  const handleTenderAction = (action: 'find_suppliers' | 'detailed_report', tenderId: string) => {
    // reset modal + selection + chat + send prompt
    handleCloseModal();
    selectOnly(tenderId);

    chatState.resetChat();

    const prompt =
      action === 'find_suppliers'
        ? 'Найди поставщиков этого для этого тендера'
        : 'Найди поставщиков для этого тендера с хорошей маржой. Найденных поставщиков проверь на благонадежность и сформируй подробный отчет.';

    chatState.sendMessage(prompt, [tenderId]);
  };

  return (
    <div className="app">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onActiveFilterChange={setActiveFilter}
      />
      <div className="main-container">
        <div className="content-wrapper">
          <TenderList
            tenders={tenders}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMoreTenders}
            selectedIds={selectedIds}
            onToggleSelect={toggleTender}
            onCardClick={handleCardClick}
          />
        </div>
        <ChatPanel
          selectedCount={selectedCount}
          onClearSelection={clearSelection}
          chatState={chatState}
        />
      </div>
      <TenderModal
        tenderId={selectedTenderId}
        onClose={handleCloseModal}
        onTenderAction={handleTenderAction}
      />
    </div>
  );
}

export default App;
