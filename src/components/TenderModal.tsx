import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import type { TenderDetails } from '../types/tenderDetails';
import styles from './TenderModal.module.css';

interface TenderModalProps {
  tenderId: string | null;
  onClose: () => void;
  onTenderAction: (action: 'find_suppliers' | 'detailed_report', tenderId: string) => void;
}

type Tab = 'info' | 'lots' | 'files';

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

export const TenderModal = ({ tenderId, onClose, onTenderAction }: TenderModalProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [tenderDetails, setTenderDetails] = useState<TenderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenderId) return;

    const loadTenderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.fetchTenderById(tenderId);
        setTenderDetails(data as any);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    loadTenderDetails();
  }, [tenderId]);

  if (!tenderId) return null;

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose}>
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Загрузка данных...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>❌ {error}</p>
              <button onClick={onClose} className={styles.closeButton}>
                Закрыть
              </button>
            </div>
          )}

          {tenderDetails && !loading && (
            <>
              <div className={styles.header}>
                <div className={styles.headerContent}>
                  <h2 className={styles.title}>{tenderDetails.announcement.name}</h2>
                  <span className={styles.number}>№ {tenderDetails.announcement.announcement_number}</span>
                </div>
                <button onClick={onClose} className={styles.closeBtn}>
                  ✕
                </button>
              </div>

              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${activeTab === 'info' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  Информация
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'lots' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('lots')}
                >
                  Лоты {tenderDetails.lots && `(${tenderDetails.lots.length})`}
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'files' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('files')}
                >
                  Файлы {tenderDetails.general_files && `(${tenderDetails.general_files.length})`}
                </button>
                <button
                  className={styles.tab}
                  type="button"
                  onClick={() => onTenderAction('find_suppliers', tenderId)}
                >
                  Найти поставщиков
                </button>
                <button
                  className={styles.tab}
                  type="button"
                  onClick={() => onTenderAction('detailed_report', tenderId)}
                >
                  Подробный отчет
                </button>
              </div>

              <div className={styles.content}>
                {activeTab === 'info' && (
                  <div className={styles.info}>
                    <div className={styles.section}>
                      <h3 className={styles.sectionTitle}>Объявление</h3>
                      <div className={styles.grid}>
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>Статус</span>
                          <span className={styles.fieldValue}>{tenderDetails.announcement.status.name}</span>
                        </div>
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>Система</span>
                          <span className={styles.fieldValue}>{tenderDetails.announcement.system.name}</span>
                        </div>
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>Метод закупки</span>
                          <span className={styles.fieldValue}>{tenderDetails.announcement.purchase_method.name}</span>
                        </div>
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>Тип закупки</span>
                          <span className={styles.fieldValue}>{tenderDetails.announcement.purchase_type.name}</span>
                        </div>
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>Опубликовано</span>
                          <span className={styles.fieldValue}>
                            {formatDate(tenderDetails.announcement.publish_date)}
                          </span>
                        </div>
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>Прием предложений</span>
                          <span className={styles.fieldValue}>
                            {formatDate(tenderDetails.announcement.offer_start_date)} -{' '}
                            {formatDate(tenderDetails.announcement.offer_end_date)}
                          </span>
                        </div>
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>Общая стоимость</span>
                          <span className={styles.fieldValue}>
                            {formatPrice(tenderDetails.announcement.total_price)}
                          </span>
                        </div>
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>Количество лотов</span>
                          <span className={styles.fieldValue}>{tenderDetails.announcement.lot_count}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.section}>
                      <h3 className={styles.sectionTitle}>Организатор</h3>
                      <div className={styles.grid}>
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>Название</span>
                          <span className={styles.fieldValue}>{tenderDetails.announcement.organizer.name}</span>
                        </div>
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>БИН</span>
                          <span className={styles.fieldValue}>{tenderDetails.announcement.organizer.iin_bin}</span>
                        </div>
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>Тип организации</span>
                          <span className={styles.fieldValue}>
                            {tenderDetails.announcement.organizer.organization_type?.name || 'Не указан'}
                          </span>
                        </div>
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>Адрес</span>
                          <span className={styles.fieldValue}>
                            {tenderDetails.announcement.organizer.address?.city || ''}{tenderDetails.announcement.organizer.address?.city && ', '}
                            {tenderDetails.announcement.organizer.address?.street || ''}{tenderDetails.announcement.organizer.address?.street && ', '}
                            {tenderDetails.announcement.organizer.address?.house || ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'lots' && (
                  <div className={styles.lots}>
                    {tenderDetails.lots && tenderDetails.lots.length > 0 ? (
                      tenderDetails.lots.map((lot) => (
                        <div key={lot.id} className={styles.lot}>
                          <div className={styles.lotHeader}>
                            <h4 className={styles.lotTitle}>
                              Лот № {lot.lot_number}
                              {lot.name && `: ${lot.name}`}
                            </h4>
                            <span className={styles.lotStatus}>{lot.status.name}</span>
                          </div>
                          {lot.description && <p className={styles.lotDescription}>{lot.description}</p>}
                          <div className={styles.lotGrid}>
                            <div className={styles.field}>
                              <span className={styles.fieldLabel}>Стоимость</span>
                              <span className={styles.fieldValue}>{formatPrice(lot.total_price)}</span>
                            </div>
                            <div className={styles.field}>
                              <span className={styles.fieldLabel}>Метод закупки</span>
                              <span className={styles.fieldValue}>
                                {lot.purchase_method?.name || 'Не указан'}
                              </span>
                            </div>
                            <div className={styles.field}>
                              <span className={styles.fieldLabel}>Организация</span>
                              <span className={styles.fieldValue}>{lot.organization?.name || 'Не указана'}</span>
                            </div>
                          </div>

                          {lot.plan_items && lot.plan_items.length > 0 && (
                            <div className={styles.planItems}>
                              <h5 className={styles.planItemsTitle}>Позиции плана ({lot.plan_items.length})</h5>
                              <div className={styles.planItemsList}>
                                {lot.plan_items.map((item, idx) => (
                                  <div key={item.id || idx} className={styles.planItem}>
                                    <div className={styles.planItemHeader}>
                                      <span className={styles.planItemNumber}>#{idx + 1}</span>
                                      <span className={styles.planItemPrice}>{formatPrice(item.total_price)}</span>
                                    </div>
                                    <div className={styles.planItemDescription}>
                                      <p className={styles.planItemText}>{item.description}</p>
                                      {item.extra_description && (
                                        <p className={styles.planItemExtra}>{item.extra_description}</p>
                                      )}
                                    </div>
                                    <div className={styles.planItemDetails}>
                                      <span className={styles.planItemDetail}>
                                        Количество: {item.count} {item.measure?.name || ''}
                                      </span>
                                      <span className={styles.planItemDetail}>
                                        За единицу: {formatPrice(item.unit_price)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className={styles.empty}>Нет данных о лотах</div>
                    )}
                  </div>
                )}

                {activeTab === 'files' && (
                  <div className={styles.files}>
                    {tenderDetails.general_files && tenderDetails.general_files.length > 0 ? (
                      tenderDetails.general_files.map((fileGroup, idx) => (
                        <div key={idx} className={styles.fileGroup}>
                          <h4 className={styles.fileGroupTitle}>{fileGroup.group.name}</h4>
                          <p className={styles.fileGroupCategory}>Категория: {fileGroup.group.category.name}</p>
                          <div className={styles.fileList}>
                            {fileGroup.group.template_file && (
                              <a
                                href={fileGroup.group.template_file.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.fileItem}
                              >
                                <span className={styles.fileIcon}>📄</span>
                                <span className={styles.fileName}>Шаблон</span>
                                <span className={styles.fileDownload}>↓</span>
                              </a>
                            )}
                            {fileGroup.files && fileGroup.files.length > 0 ? (
                              fileGroup.files.map((file) => (
                                <a
                                  key={file.id}
                                  href={file.file.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.fileItem}
                                >
                                  <span className={styles.fileIcon}>📄</span>
                                  <span className={styles.fileName}>{file.name || file.original_name || 'Файл'}</span>
                                  <span className={styles.fileDownload}>↓</span>
                                </a>
                              ))
                            ) : !fileGroup.group.template_file ? (
                              <p className={styles.noFiles}>Файлы не загружены</p>
                            ) : null}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.empty}>Нет файлов</div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
