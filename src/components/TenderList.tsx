import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { TenderCard } from './TenderCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import type { Tender } from '../types/tender';
import styles from './TenderList.module.css';

interface TenderListProps {
  tenders: Tender[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onCardClick: (id: string) => void;
}

export const TenderList = ({
  tenders,
  loading,
  hasMore,
  onLoadMore,
  selectedIds,
  onToggleSelect,
  onCardClick,
}: TenderListProps) => {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      onLoadMore();
    }
  }, [inView, hasMore, loading, onLoadMore]);

  if (tenders.length === 0 && !loading) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🔍</div>
        <h3 className={styles.emptyTitle}>Тендеры не найдены</h3>
        <p className={styles.emptyText}>Попробуйте изменить параметры поиска</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {tenders.map((tender, index) => (
        <TenderCard
          key={tender._id}
          tender={tender}
          isSelected={selectedIds.has(tender._id)}
          onToggleSelect={onToggleSelect}
          onCardClick={onCardClick}
        />
      ))}

      {hasMore && (
        <div ref={ref} className={styles.loaderContainer}>
          <LoadingSkeleton />
        </div>
      )}

      {loading && !hasMore && <LoadingSkeleton />}
    </div>
  );
};
