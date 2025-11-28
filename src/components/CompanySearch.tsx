import { useEffect, useState } from 'react';
import { companyApi } from '../services/companyApi';
import type { Company } from '../types/company';
import { CompanySearchModal } from './CompanySearchModal';
import { CompanyDetailsModal } from './CompanyDetailsModal';
import styles from './CompanySearch.module.css';

interface CompanySearchProps {
  toolInput: {
    query: string;
  };
}

export const CompanySearch = ({ toolInput }: CompanySearchProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedCompanyBin, setSelectedCompanyBin] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await companyApi.searchCompanies(toolInput.query);
        setCompanies(response.result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить компании');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [toolInput.query]);

  const handleCompanyClick = (bin: string) => {
    setSelectedCompanyBin(bin);
  };

  const displayedCompanies = companies.slice(0, 3);
  const hasMore = companies.length > 3;

  return (
    <div>
      <div className={styles.toolHeader}>
        <span className={styles.toolIcon}>🏢</span>
        <span className={styles.toolTitle}>Поиск компании: {toolInput.query}</span>
      </div>

      <div className={styles.resultsContainer}>
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeleton}>
                <div className={`${styles.skeletonLine} ${styles.title}`} />
                <div className={`${styles.skeletonLine} ${styles.subtitle}`} />
              </div>
            ))}
          </>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : companies.length === 0 ? (
          <div className={styles.error}>Компании не найдены</div>
        ) : (
          <>
            {displayedCompanies.map((company) => (
              <div
                key={company.bin}
                className={styles.companyItem}
                onClick={() => handleCompanyClick(company.bin)}
              >
                <div className={styles.companyName}>{company.name_ru}</div>
                <div className={styles.companyBin}>БИН/ИИН: {company.bin}</div>
              </div>
            ))}
            {hasMore && (
              <button className={styles.showAllButton} onClick={() => setShowAllModal(true)}>
                Посмотреть все ({companies.length})
              </button>
            )}
          </>
        )}
      </div>

      {showAllModal && (
        <CompanySearchModal
          companies={companies}
          query={toolInput.query}
          onClose={() => setShowAllModal(false)}
          onCompanyClick={handleCompanyClick}
        />
      )}

      {selectedCompanyBin && (
        <CompanyDetailsModal
          iinOrBin={selectedCompanyBin}
          onClose={() => setSelectedCompanyBin(null)}
        />
      )}
    </div>
  );
};
