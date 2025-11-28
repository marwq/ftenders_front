import { useState } from 'react';
import { CompanyDetailsModal } from './CompanyDetailsModal';
import styles from './CompanyCheck.module.css';

interface CompanyCheckProps {
  toolInput: {
    iin_or_bin: string;
  };
}

export const CompanyCheck = ({ toolInput }: CompanyCheckProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className={styles.toolMessage}>
        <span className={styles.toolIcon}>🔍</span>
        <span className={styles.toolText}>Проверяю компанию {toolInput.iin_or_bin}</span>
      </div>

      <button className={styles.checkButton} onClick={() => setShowModal(true)}>
        Открыть благонадежность
      </button>

      {showModal && (
        <CompanyDetailsModal
          iinOrBin={toolInput.iin_or_bin}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
