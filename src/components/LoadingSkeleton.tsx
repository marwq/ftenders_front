import styles from './LoadingSkeleton.module.css';

export const LoadingSkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.checkbox} />
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.line} style={{ width: '30%' }} />
          <div className={styles.line} style={{ width: '20%' }} />
        </div>
        <div className={styles.title} />
        <div className={styles.details}>
          <div className={styles.line} style={{ width: '80%' }} />
          <div className={styles.line} style={{ width: '70%' }} />
          <div className={styles.line} style={{ width: '60%' }} />
        </div>
        <div className={styles.footer}>
          <div className={styles.line} style={{ width: '40%' }} />
          <div className={styles.line} style={{ width: '30%' }} />
        </div>
      </div>
    </div>
  );
};
