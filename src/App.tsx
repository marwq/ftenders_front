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
  const [priceFrom, setPriceFrom] = useState<number | undefined>(undefined);
  const [priceTo, setPriceTo] = useState<number | undefined>(undefined);
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>(null);
  const [shouldOpenChat, setShouldOpenChat] = useState(false);

  // Convert filter to is_active parameter
  const isActiveParam =
    activeFilter === 'all' ? undefined : activeFilter === 'active' ? true : false;

  const { tenders, loading, hasMore, loadMoreTenders } = useTenders(
    searchQuery,
    isActiveParam,
    priceFrom,
    priceTo
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
    handleCloseModal();
    selectOnly(tenderId);

    chatState.resetChat();

    const prompt =
      action === 'find_suppliers'
        ? 'Найди поставщиков этого для этого тендера'
        : 'Найди поставщиков для этого тендера с хорошей маржой. Найденных поставщиков проверь на благонадежность и сформируй подробный отчет.';

    chatState.sendMessage(prompt, [tenderId]);

    setShouldOpenChat(true);
    setTimeout(() => setShouldOpenChat(false), 100);
  };

  return (
    <div className="app">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onActiveFilterChange={setActiveFilter}
        priceFrom={priceFrom}
        priceTo={priceTo}
        onPriceFromChange={setPriceFrom}
        onPriceToChange={setPriceTo}
        selectedCount={selectedCount}
        onClearSelection={clearSelection}
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
          shouldOpen={shouldOpenChat}
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
