import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Header.module.css';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: 'all' | 'active' | 'inactive';
  onActiveFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
  priceFrom?: number;
  priceTo?: number;
  onPriceFromChange: (value: number | undefined) => void;
  onPriceToChange: (value: number | undefined) => void;
  selectedCount: number;
  onClearSelection: () => void;
}

const filterOptions: { value: 'all' | 'active' | 'inactive'; label: string }[] = [
  { value: 'all', label: 'Все тендеры' },
  { value: 'active', label: 'Активные' },
  { value: 'inactive', label: 'Неактивные' },
];

export const Header = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onActiveFilterChange,
  priceFrom,
  priceTo,
  onPriceFromChange,
  onPriceToChange,
  selectedCount,
  onClearSelection,
}: HeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLabel = filterOptions.find((o) => o.value === activeFilter)?.label;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <span className={styles.logoPrefix}>i</span>
            <span className={styles.logoText}>Tenders</span>
          </div>
          <div className={styles.search}>
            <input
              type="search"
              placeholder="Поиск тендеров..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className={styles.dropdown} ref={dropdownRef}>
            <button
              className={styles.dropdownToggle}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{activeLabel}</span>
              <ChevronDown size={16} className={`${styles.dropdownArrow} ${dropdownOpen ? styles.dropdownArrowOpen : ''}`} />
            </button>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`${styles.dropdownItem} ${activeFilter === option.value ? styles.dropdownItemActive : ''}`}
                    onClick={() => {
                      onActiveFilterChange(option.value);
                      setDropdownOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className={styles.priceFilter}>
            <input
              type="number"
              placeholder="Цена от"
              className={styles.priceInput}
              value={priceFrom ?? ''}
              onChange={(e) => onPriceFromChange(e.target.value ? Number(e.target.value) : undefined)}
            />
            <span className={styles.priceSeparator}>—</span>
            <input
              type="number"
              placeholder="Цена до"
              className={styles.priceInput}
              value={priceTo ?? ''}
              onChange={(e) => onPriceToChange(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className={styles.right}>
          <h2 className={styles.title}>AI Агент</h2>
          {selectedCount > 0 && (
            <div className={styles.selectedBadge}>
              <span className={styles.selectedText}>Выделено {selectedCount}</span>
              <button onClick={onClearSelection} className={styles.clearButton}>
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
