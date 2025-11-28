import styles from './Header.module.css';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: 'all' | 'active' | 'inactive';
  onActiveFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
}

export const Header = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onActiveFilterChange,
}: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <img src="/logo.png" alt="Forte Tenders" className={styles.logo} />
        <div className={styles.search}>
          <input
            type="search"
            placeholder="Поиск тендеров..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <select
          className={styles.filterSelect}
          value={activeFilter}
          onChange={(e) => onActiveFilterChange(e.target.value as 'all' | 'active' | 'inactive')}
        >
          <option value="all">Все тендеры</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
        </select>
      </div>
    </header>
  );
};
