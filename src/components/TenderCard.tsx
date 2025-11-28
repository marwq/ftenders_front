import { motion } from 'framer-motion';
import type { Tender } from '../types/tender';
import styles from './TenderCard.module.css';

interface TenderCardProps {
  tender: Tender;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onCardClick: (id: string) => void;
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0,
  }).format(price);
};

export const TenderCard = ({ tender, isSelected, onToggleSelect, onCardClick }: TenderCardProps) => {
  const { announcement } = tender;
  const statusColor = tender.is_active ? 'active' : 'inactive';

  const handleCardClick = () => {
    onCardClick(tender._id);
  };

  return (
    <motion.div
      layout
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={handleCardClick}
    >
      <div className={styles.checkbox} onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(tender._id)}
          className={styles.checkboxInput}
          id={`tender-${tender._id}`}
        />
        <label htmlFor={`tender-${tender._id}`} className={styles.checkboxLabel} />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <span className={styles.number}>№ {announcement.announcement_number}</span>
            <span className={`${styles.status} ${styles[statusColor]}`}>
              {announcement.status.name}
            </span>
          </div>
          <h3 className={styles.title}>{announcement.name}</h3>
        </div>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.label}>Организатор:</span>
            <span className={styles.value}>{announcement.organizer.name}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Метод закупки:</span>
            <span className={styles.value}>{announcement.purchase_method.name}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Регион:</span>
            <span className={styles.value}>{announcement.organizer.address.city}</span>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceLabel}>Общая стоимость</span>
            <span className={styles.priceValue}>{formatPrice(announcement.total_price)}</span>
          </div>
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>📦</span>
              <span>{announcement.lot_count} лотов</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>📅</span>
              <span>До {formatDate(announcement.offer_end_date)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
