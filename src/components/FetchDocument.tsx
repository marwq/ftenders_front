import styles from './FetchDocument.module.css';

interface FetchDocumentProps {
  toolInput: {
    url?: string;
    is_image?: boolean | null;
  };
}

export const FetchDocument = ({ toolInput }: FetchDocumentProps) => {
  const url = toolInput?.url;
  const isImage = Boolean(toolInput?.is_image);

  const renderIcon = () => (
    <span className={styles.icon} aria-hidden="true">
      {isImage ? '🖼️' : '📄'}
    </span>
  );

  if (!url) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          {renderIcon()}
          <div className={styles.title}>{isImage ? 'Анализирую изображение' : 'Читаю документ'}</div>
        </div>
        <div>Не удалось получить ссылку</div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {renderIcon()}
        <div className={styles.title}>{isImage ? 'Анализирую изображение' : 'Читаю документ'}</div>
      </div>

      {isImage ? (
        <div className={styles.imageFrame}>
          <img src={url} alt="Документ для анализа" className={styles.image} />
        </div>
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className={styles.link}>
          <span className={styles.linkIcon}>📄</span>
          <span className={styles.linkLabel}>{url}</span>
        </a>
      )}
    </div>
  );
};
