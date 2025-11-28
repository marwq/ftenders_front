import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { SatuProduct, SatuProductDetails } from '../types/satuProduct';
import { satuApi } from '../services/satuApi';
import styles from './SatuProductModal.module.css';

interface SatuProductModalProps {
  product: SatuProduct;
  onClose: () => void;
}

type TabType = 'info' | 'delivery';

export const SatuProductModal = ({ product, onClose }: SatuProductModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [details, setDetails] = useState<SatuProductDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const getProductUrl = () => {
    const slug = product.product.urlText || 'product';
    return `https://satu.kz/p${product.product.id}-${slug}.html`;
  };

  const handleOpenSatu = () => {
    window.open(getProductUrl(), '_blank');
  };

  useEffect(() => {
    if (activeTab === 'delivery' && !details && !loadingDetails) {
      const fetchDetails = async () => {
        try {
          setLoadingDetails(true);
          setDetailsError(null);
          const data = await satuApi.getProductDetails(product.product.id);
          setDetails(data);
        } catch (err) {
          setDetailsError(err instanceof Error ? err.message : 'Не удалось загрузить данные');
        } finally {
          setLoadingDetails(false);
        }
      };

      fetchDetails();
    }
  }, [activeTab, product.product.id, details, loadingDetails]);

  const formatPrice = (price: number | null, currency: string, priceFrom?: boolean) => {
    if (price === null) return 'Цена по запросу';
    const formatted = `${price.toLocaleString('ru-RU')} ${currency}`;
    return priceFrom ? `от ${formatted}` : formatted;
  };

  const getPresenceStatus = () => {
    const { presence, catalogPresence } = product.product;
    if (presence.isAvailable) return { text: 'В наличии', type: 'positive' };
    if (presence.isOrderable) return { text: 'Под заказ', type: 'warning' };
    if (presence.isWait) return { text: 'Ожидается', type: 'warning' };
    return { text: catalogPresence?.title || 'Нет в наличии', type: 'default' };
  };

  const presenceStatus = getPresenceStatus();

  const renderDeliveryRegions = (regions: any[], level = 0) => {
    return (
      <ul className={styles.regionList} style={{ paddingLeft: level > 0 ? '1.5rem' : '0' }}>
        {regions.map((region, idx) => (
          <li key={idx}>
            {region.name}
            {region.subRegions && region.subRegions.length > 0 && renderDeliveryRegions(region.subRegions, level + 1)}
          </li>
        ))}
      </ul>
    );
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
            <h2 className={styles.title}>{product.product.name}</h2>
            <div className={styles.subtitle}>
              <img src="/satu.svg" alt="Satu.kz" className={styles.satuIcon} />
              <span>Товар с Satu.kz</span>
            </div>
          </div>
          <button onClick={handleOpenSatu} className={styles.closeButton} title="Открыть на Satu.kz" style={{ marginRight: '0.5rem' }}>
            <img src="/satu.svg" alt="Открыть на Satu.kz" style={{ width: '20px', height: '20px' }} />
          </button>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'info' ? styles.active : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Информация
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'delivery' ? styles.active : ''}`}
            onClick={() => setActiveTab('delivery')}
          >
            Детали, контакты и оплата
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'info' && (
            <>
              {product.product.image400x400 && (
                <img
                  src={product.product.image400x400}
                  alt={product.product.imageAlt || product.product.name}
                  className={styles.productImage}
                />
              )}

              <div className={styles.priceSection}>
                <div className={styles.mainPrice}>
                  {formatPrice(product.product.price, product.product.priceCurrencyLocalized, product.product.priceFrom)}
                </div>
                {product.product.hasDiscount && (
                  <div>
                    <span className={styles.originalPrice}>
                      {product.product.priceOriginal} {product.product.priceCurrencyLocalized}
                    </span>
                    {product.product.discountDaysLabel && (
                      <span className={styles.discount}>{product.product.discountDaysLabel}</span>
                    )}
                  </div>
                )}
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  за {product.product.measureUnit}
                </div>

                {product.product.wholesalePrices && product.product.wholesalePrices.length > 0 && (
                  <div className={styles.wholesalePrices}>
                    <div className={styles.wholesaleTitle}>Оптовые цены:</div>
                    {product.product.wholesalePrices.map((wp, idx) => (
                      <div key={idx} className={styles.wholesaleItem}>
                        От {wp.minimumOrderQuantity} {product.product.measureUnit}: {wp.price} {product.product.priceCurrencyLocalized}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.companyInfo}>
                <div className={styles.companyName}>{product.product.company.name}</div>
                <div className={styles.companyMeta}>
                  <span>{product.product.company.regionName}, {product.product.company.countryName}</span>
                  {product.product.company.inTopSegment && (
                    <span className={`${styles.badge} ${styles.positive}`}>ТОП-сегмент</span>
                  )}
                  {product.product.company.opinionStats && product.product.company.opinionStats.opinionTotal > 0 && (
                    <span className={styles.badge}>
                      ⭐ {product.product.company.opinionStats.opinionPositivePercent}% ({product.product.company.opinionStats.opinionTotal})
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>Наличие</span>
                <div className={styles.fieldValue}>
                  <span className={`${styles.badge} ${styles[presenceStatus.type as 'positive' | 'warning']}`}>
                    {presenceStatus.text}
                  </span>
                  {product.product.presence.isEnding && (
                    <span className={`${styles.badge} ${styles.warning}`} style={{ marginLeft: '0.5rem' }}>
                      Заканчивается
                    </span>
                  )}
                </div>
              </div>

              {product.product.sku && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Артикул</span>
                  <div className={styles.fieldValue}>{product.product.sku}</div>
                </div>
              )}

              {product.product.manufacturerInfo && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Производитель</span>
                  <div className={styles.fieldValue}>{product.product.manufacturerInfo.name}</div>
                </div>
              )}

              {product.product.sellingType?.universal?.title_filter_set && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Тип продажи</span>
                  <div className={styles.fieldValue}>{product.product.sellingType.universal.title_filter_set}</div>
                </div>
              )}

              {product.product.productOpinionCounters && product.product.productOpinionCounters.count > 0 && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Отзывы о товаре</span>
                  <div className={styles.fieldValue}>
                    Рейтинг: ⭐ {product.product.productOpinionCounters.rating} ({product.product.productOpinionCounters.count} отзывов)
                  </div>
                </div>
              )}

              <button onClick={handleOpenSatu} className={styles.satuButton}>
                <img src="/satu.svg" alt="Satu.kz" style={{ width: '20px', height: '20px' }} />
                <span>Открыть на Satu.kz</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </button>
            </>
          )}

          {activeTab === 'delivery' && (
            <>
              {loadingDetails ? (
                <div className={styles.skeleton}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={styles.skeletonBlock} style={{ width: `${Math.random() * 30 + 60}%` }} />
                  ))}
                </div>
              ) : detailsError ? (
                <div style={{ color: '#dc2626', padding: '1rem', textAlign: 'center' }}>{detailsError}</div>
              ) : details ? (
                <>
                  <div className={styles.companyInfo}>
                    <div className={styles.companyName}>{details.contacts.data.product.company.name}</div>
                    {details.contacts.data.product.company.webSiteUrl && (
                      <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        <a href={details.contacts.data.product.company.webSiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#FF6B00' }}>
                          {details.contacts.data.product.company.webSiteUrl}
                        </a>
                      </div>
                    )}
                    <div style={{ marginTop: '1rem' }}>
                      <div className={styles.fieldLabel}>Телефоны</div>
                      <div className={styles.phoneList}>
                        {details.contacts.data.product.company.phones.map((phone, idx) => (
                          <a key={idx} href={`tel:${phone.number}`} className={styles.phoneItem}>
                            {phone.number}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      Последняя активность: {details.contacts.data.product.company.lastActivityTime}
                      <br />
                      {details.contacts.data.product.company.isWorkingNow && '🟢 Работает прямо сейчас'}
                    </div>
                  </div>

                  {details.delivery_payment.data.product.company.deliveryRegions && details.delivery_payment.data.product.company.deliveryRegions.length > 0 && (
                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Регионы доставки</span>
                      {renderDeliveryRegions(details.delivery_payment.data.product.company.deliveryRegions)}
                    </div>
                  )}

                  {details.delivery_payment.data.product.paymentOptions && details.delivery_payment.data.product.paymentOptions.length > 0 && (
                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Способы оплаты</span>
                      <ul className={styles.regionList}>
                        {details.delivery_payment.data.product.paymentOptions.map((payment) => (
                          <li key={payment.id}>{payment.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {details.delivery_payment.data.product.deliveryOptions && details.delivery_payment.data.product.deliveryOptions.length > 0 && (
                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Способы доставки</span>
                      <ul className={styles.regionList}>
                        {details.delivery_payment.data.product.deliveryOptions.map((delivery, idx) => (
                          <li key={idx}>
                            {delivery.name}
                            {delivery.comment && <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}> — {delivery.comment}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : null}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
