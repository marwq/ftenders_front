import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { companyApi } from '../services/companyApi';
import type { CompanyDetails } from '../types/company';
import styles from './CompanyDetailsModal.module.css';

interface CompanyDetailsModalProps {
  iinOrBin: string;
  onClose: () => void;
}

type TabType = 'info' | 'risks' | 'courts' | 'licenses' | 'zakup' | 'branches' | 'similar';

export const CompanyDetailsModal = ({ iinOrBin, onClose }: CompanyDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [details, setDetails] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBin, setCurrentBin] = useState(iinOrBin);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await companyApi.getCompanyDetails(currentBin);
        setDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [currentBin]);

  const handleBinChange = (newBin: string) => {
    setCurrentBin(newBin);
    setActiveTab('info');
  };

  const renderTabs = () => {
    const tabs: Array<{ key: TabType; label: string; count?: number }> = [
      { key: 'info', label: 'Информация' },
      { key: 'risks', label: 'Риски', count: details?.risks?.total_risks },
      { key: 'courts', label: 'Судебные дела', count: details?.courts?.company?.length },
      { key: 'licenses', label: 'Лицензии', count: details?.licenses?.total_count },
      { key: 'zakup', label: 'Госзакупки' },
      { key: 'branches', label: 'Филиалы', count: details?.company?.branches?.length },
      { key: 'similar', label: 'Похожие компании' },
    ];

    return tabs.map((tab) => (
      <button
        key={tab.key}
        className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
        onClick={() => setActiveTab(tab.key)}
      >
        {tab.label}
        {tab.count !== undefined && tab.count > 0 && (
          <span className={styles.tabBadge}>{tab.count}</span>
        )}
      </button>
    ));
  };

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
            <h2 className={styles.title}>
              {loading ? 'Загрузка...' : details?.company.name_ru || 'Проверка компании'}
            </h2>
            <div className={styles.subtitle}>БИН/ИИН: {currentBin}</div>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        {!loading && !error && (
          <div className={styles.tabs}>
            {renderTabs()}
          </div>
        )}

        <div className={styles.content}>
          {loading ? (
            <div className={styles.skeleton}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={styles.skeletonBlock} style={{ width: `${Math.random() * 30 + 60}%` }} />
              ))}
            </div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : details ? (
            <>
              {activeTab === 'info' && <InfoTab details={details} />}
              {activeTab === 'risks' && <RisksTab details={details} />}
              {activeTab === 'courts' && <CourtsTab details={details} />}
              {activeTab === 'licenses' && <LicensesTab details={details} />}
              {activeTab === 'zakup' && <ZakupTab details={details} />}
              {activeTab === 'branches' && (
                <BranchesTab details={details} onBinClick={handleBinChange} />
              )}
              {activeTab === 'similar' && <SimilarTab details={details} onBinClick={handleBinChange} />}
            </>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
};

const InfoTab = ({ details }: { details: CompanyDetails }) => (
  <div className={styles.section}>
    <div className={styles.field}>
      <span className={styles.fieldLabel}>Название</span>
      <div className={styles.fieldValue}>{details.company.name_ru}</div>
    </div>

    {details.company.form && (
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Форма</span>
        <div className={styles.fieldValue}>{details.company.form}</div>
      </div>
    )}

    {details.company.state && (
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Регион</span>
        <div className={styles.fieldValue}>{details.company.state}</div>
      </div>
    )}

    {details.company.registration_date && (
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Регистрация</span>
        <div className={styles.fieldValue}>{details.company.registration_date}</div>
      </div>
    )}

    {details.company.director && (
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Директор</span>
        <div className={styles.fieldValue}>{details.company.director}</div>
      </div>
    )}

    {details.company.locality_ru && (
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Населенный пункт</span>
        <div className={styles.fieldValue}>{details.company.locality_ru}</div>
      </div>
    )}

    {details.company.legal_address && (
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Юридический адрес</span>
        <div className={styles.fieldValue}>{details.company.legal_address}</div>
      </div>
    )}

    {details.company.activity_ru && (
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Основной ОКЕД</span>
        <div className={styles.fieldValue}>
          ({details.company.OKED_main_code}) {details.company.activity_ru}
        </div>
      </div>
    )}

    {details.company.OKED_addition_codes && details.company.OKED_addition_codes.length > 0 && (
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Дополнительные ОКЕД</span>
        <div className={styles.fieldValue}>{details.company.OKED_addition_codes.join(', ')}</div>
      </div>
    )}

    {details.company.sector && (
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Сектор</span>
        <div className={styles.fieldValue}>{details.company.sector}</div>
      </div>
    )}

    {details.contacts && (
      <>
        {details.contacts.email && (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Email</span>
            <div className={styles.fieldValue}>
              <a href={`mailto:${details.contacts.email}`}>{details.contacts.email}</a>
            </div>
          </div>
        )}

        {details.contacts.website && (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Сайт</span>
            <div className={styles.fieldValue}>
              <a href={details.contacts.website} target="_blank" rel="noopener noreferrer">
                {details.contacts.website}
              </a>
            </div>
          </div>
        )}

        {details.contacts.phones && details.contacts.phones.length > 0 && (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Телефоны</span>
            <div className={styles.fieldValue}>
              {details.contacts.phones.map((phone, idx) => (
                <a key={idx} href={`tel:${phone}`} style={{ display: 'block' }}>
                  {phone}
                </a>
              ))}
            </div>
          </div>
        )}
      </>
    )}
  </div>
);

const RisksTab = ({ details }: { details: CompanyDetails }) => {
  if (!details.risks || details.risks.total_risks === 0) {
    return <div className={styles.emptyState}>Рисков не обнаружено</div>;
  }

  return (
    <div className={styles.section}>
      <div className={styles.riskSummary}>
        Обнаружено {details.risks.total_risks} риск(ов)
      </div>

      {details.risks.company.courts && details.risks.company.courts.length > 0 && (
        <div className={styles.riskBlock}>
          <div className={styles.riskTitle}>Судебные дела компании</div>
          {details.risks.company.courts.map((court, idx) => (
            <div key={idx} className={styles.riskItem}>
              Суд {court.number}: {court.type} дел(о/а)
            </div>
          ))}
        </div>
      )}

      {details.risks.director.wrong_address && details.risks.director.wrong_address.length > 0 && (
        <div className={styles.riskBlock}>
          <div className={styles.riskTitle}>Проблемы с адресом директора</div>
          {details.risks.director.wrong_address.map((item, idx) => (
            <div key={idx} className={styles.riskItem}>
              БИН: {item.bin}, Директор: {item.director}
              <br />
              Номер записи: {item.number}, Дата: {item.date}
            </div>
          ))}
        </div>
      )}

      {details.risks.company.violation && details.risks.company.violation.length > 0 && (
        <div className={styles.riskBlock}>
          <div className={styles.riskTitle}>Нарушения компании: {details.risks.company.violation.length}</div>
        </div>
      )}

      {details.risks.company.arrears && details.risks.company.arrears.length > 0 && (
        <div className={styles.riskBlock}>
          <div className={styles.riskTitle}>Задолженности компании: {details.risks.company.arrears.length}</div>
        </div>
      )}

      {details.risks.company.bankruptcy && details.risks.company.bankruptcy.length > 0 && (
        <div className={styles.riskBlock}>
          <div className={styles.riskTitle}>Банкротство компании: {details.risks.company.bankruptcy.length}</div>
        </div>
      )}

      {details.risks.company.inactive && details.risks.company.inactive.length > 0 && (
        <div className={styles.riskBlock}>
          <div className={styles.riskTitle}>Неактивность компании: {details.risks.company.inactive.length}</div>
        </div>
      )}

      {details.risks.director.bankruptcy && details.risks.director.bankruptcy.length > 0 && (
        <div className={styles.riskBlock}>
          <div className={styles.riskTitle}>Банкротство директора: {details.risks.director.bankruptcy.length}</div>
        </div>
      )}
    </div>
  );
};

const CourtsTab = ({ details }: { details: CompanyDetails }) => {
  if (!details.courts?.company || details.courts.company.length === 0) {
    return <div className={styles.emptyState}>Судебных дел не найдено</div>;
  }

  return (
    <div className={styles.section}>
      <div className={styles.courtSummary}>
        Найдено {details.courts.company.length} дел(о/а)
      </div>

      {details.courts.company.map((courtCase, idx) => (
        <div key={idx} className={styles.courtCase}>
          <div className={styles.courtHeader}>
            <div className={styles.courtNumber}>Дело № {courtCase.number.trim()}</div>
            <div className={styles.courtDate}>{courtCase.date}</div>
          </div>

          <div className={styles.courtField}>
            <span className={styles.courtLabel}>Тип:</span>
            <span>{courtCase.type}</span>
          </div>

          <div className={styles.courtField}>
            <span className={styles.courtLabel}>Истец:</span>
            <span>{courtCase.plaintiff}</span>
          </div>

          <div className={styles.courtField}>
            <span className={styles.courtLabel}>Ответчик:</span>
            <span>{courtCase.defendant}</span>
          </div>

          <div className={styles.courtField}>
            <span className={styles.courtLabel}>Судья:</span>
            <span>{courtCase.judge.trim()}</span>
          </div>

          {courtCase.claims && courtCase.claims.length > 0 && (
            <div className={styles.courtField}>
              <span className={styles.courtLabel}>Требования:</span>
              <ul className={styles.courtList}>
                {courtCase.claims.map((claim, i) => (
                  <li key={i}>{claim}</li>
                ))}
              </ul>
            </div>
          )}

          {courtCase.results && courtCase.results.length > 0 && (
            <div className={styles.courtField}>
              <span className={styles.courtLabel}>Результаты:</span>
              <ul className={styles.courtList}>
                {courtCase.results.map((result, i) => (
                  <li key={i}>{result}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const LicensesTab = ({ details }: { details: CompanyDetails }) => {
  if (!details.licenses || details.licenses.total_count === 0) {
    return <div className={styles.emptyState}>Лицензий не найдено</div>;
  }

  return (
    <div className={styles.section}>
      <div className={styles.licenseSummary}>
        Всего {details.licenses.total_count} лицензий
      </div>
    </div>
  );
};

const ZakupTab = ({ details }: { details: CompanyDetails }) => {
  if (!details.company.zakup) {
    return <div className={styles.emptyState}>Данные о госзакупках отсутствуют</div>;
  }

  const zakup = details.company.zakup;

  return (
    <div className={styles.section}>
      {zakup.number_reg && (
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Регистрационный номер</span>
          <div className={styles.fieldValue}>{zakup.number_reg}</div>
        </div>
      )}

      <div className={styles.field}>
        <span className={styles.fieldLabel}>Статусы</span>
        <div className={styles.statusList}>
          <div className={styles.statusItem}>
            <span>Резидент:</span>
            <span className={zakup.mark_resident ? styles.statusYes : styles.statusNo}>
              {zakup.mark_resident ? 'Да' : 'Нет'}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span>Национальная компания:</span>
            <span className={zakup.mark_national_company ? styles.statusYes : styles.statusNo}>
              {zakup.mark_national_company ? 'Да' : 'Нет'}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span>Поставщик:</span>
            <span className={zakup.supplier ? styles.statusYes : styles.statusNo}>
              {zakup.supplier ? 'Да' : 'Нет'}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span>Заказчик:</span>
            <span className={zakup.customer ? styles.statusYes : styles.statusNo}>
              {zakup.customer ? 'Да' : 'Нет'}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span>Организатор:</span>
            <span className={zakup.organizer ? styles.statusYes : styles.statusNo}>
              {zakup.organizer ? 'Да' : 'Нет'}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span>Государственная монополия:</span>
            <span className={zakup.mark_state_monopoly ? styles.statusYes : styles.statusNo}>
              {zakup.mark_state_monopoly ? 'Да' : 'Нет'}
            </span>
          </div>
        </div>
      </div>

      {zakup.bank && zakup.bank.length > 0 && (
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Банковские счета</span>
          <div className={styles.fieldValue}>{zakup.bank.length}</div>
        </div>
      )}
    </div>
  );
};

const BranchesTab = ({
  details,
  onBinClick,
}: {
  details: CompanyDetails;
  onBinClick: (bin: string) => void;
}) => {
  if (!details.company.branches || details.company.branches.length === 0) {
    return <div className={styles.emptyState}>Филиалов не найдено</div>;
  }

  return (
    <div className={styles.section}>
      <div className={styles.branchSummary}>
        {details.company.branches.length} филиал(ов)
      </div>

      {details.company.branches.map((branch, idx) => (
        <div
          key={idx}
          className={`${styles.branchItem} ${styles.clickable}`}
          onClick={() => onBinClick(branch.bin)}
        >
          <div className={styles.branchName}>{branch.name_ru}</div>
          <div className={styles.branchDetails}>
            <span>БИН: {branch.bin}</span>
            <span className={styles.branchStatus}>Статус: {branch.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const SimilarTab = ({ details, onBinClick }: { details: CompanyDetails; onBinClick: (bin: string) => void }) => {
  if (!details.company.similar) {
    return <div className={styles.emptyState}>Похожих компаний не найдено</div>;
  }

  const { by_address, by_director } = details.company.similar;
  const hasAddressSimilar = by_address && by_address.total > 0;
  const hasDirectorSimilar = by_director && by_director.total > 0;

  if (!hasAddressSimilar && !hasDirectorSimilar) {
    return <div className={styles.emptyState}>Похожих компаний не найдено</div>;
  }

  return (
    <div className={styles.section}>
      {hasAddressSimilar && (
        <div className={styles.similarBlock}>
          <div className={styles.similarTitle}>
            По адресу (всего {by_address.total_search})
          </div>
          {by_address.result.map((sim, idx) => (
            <div
              key={idx}
              className={`${styles.similarItem} ${styles.clickable}`}
              onClick={() => onBinClick(sim.bin)}
            >
              <div className={styles.similarName}>{sim.name_ru}</div>
              <div className={styles.similarDetails}>
                БИН: {sim.bin} • Директор: {sim.director}
              </div>
              <div className={styles.similarAddress}>{sim.legal_address}</div>
            </div>
          ))}
        </div>
      )}

      {hasDirectorSimilar && (
        <div className={styles.similarBlock}>
          <div className={styles.similarTitle}>
            По директору (всего {by_director.total_search})
          </div>
          {by_director.result.map((sim, idx) => (
            <div
              key={idx}
              className={`${styles.similarItem} ${styles.clickable}`}
              onClick={() => onBinClick(sim.bin)}
            >
              <div className={styles.similarName}>{sim.name_ru}</div>
              <div className={styles.similarDetails}>БИН: {sim.bin}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
