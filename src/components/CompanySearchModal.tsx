import { motion } from 'framer-motion';
import type { Company } from '../types/company';
import styles from './CompanySearchModal.module.css';

interface CompanySearchModalProps {
  companies: Company[];
  query: string;
  onClose: () => void;
  onCompanyClick: (bin: string) => void;
}

export const CompanySearchModal = ({ companies, query, onClose, onCompanyClick }: CompanySearchModalProps) => {
  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>Результаты поиска: {query}</h2>
            <div className={styles.subtitle}>Найдено компаний: {companies.length}</div>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {companies.map((company) => (
            <div
              key={company.bin}
              className={styles.companyCard}
              onClick={() => {
                onClose();
                onCompanyClick(company.bin);
              }}
            >
              <div className={styles.companyHeader}>
                <div className={styles.companyName}>{company.name_ru}</div>
                <div className={styles.companyBin}>БИН/ИИН: {company.bin}</div>
              </div>

              <div className={styles.companyDetails}>
                {company.form && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Форма:</span>
                    <span className={styles.detailValue}>{company.form}</span>
                  </div>
                )}
                {company.state && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Регион:</span>
                    <span className={styles.detailValue}>{company.state}</span>
                  </div>
                )}
                {company.registration_date && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Регистрация:</span>
                    <span className={styles.detailValue}>{company.registration_date}</span>
                  </div>
                )}
                {company.director && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Директор:</span>
                    <span className={styles.detailValue}>{company.director}</span>
                  </div>
                )}
                {company.locality_ru && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Населенный пункт:</span>
                    <span className={styles.detailValue}>{company.locality_ru}</span>
                  </div>
                )}
                {company.legal_address && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Адрес:</span>
                    <span className={styles.detailValue}>{company.legal_address}</span>
                  </div>
                )}
                {company.activity_ru && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Деятельность:</span>
                    <span className={styles.detailValue}>
                      ({company.OKED_main_code}) {company.activity_ru}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
