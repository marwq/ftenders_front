import { useEffect, useState } from 'react';
import { satuApi } from '../services/satuApi';
import type { SatuProduct } from '../types/satuProduct';
import { SatuProductModal } from './SatuProductModal';
import styles from './SatuProductSearch.module.css';

interface SatuProductSearchProps {
  toolInput: {
    query: string;
    page: number;
    price_lower_than?: number;
  };
}

export const SatuProductSearch = ({ toolInput }: SatuProductSearchProps) => {
  const [products, setProducts] = useState<SatuProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<SatuProduct | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await satuApi.searchProducts(toolInput.query, toolInput.page);
        setProducts(response.data.listing.page.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toolInput.query, toolInput.page]);

  const getProductUrl = (product: SatuProduct) => {
    const slug = product.product.urlText || 'product';
    return `https://satu.kz/p${product.product.id}-${slug}.html`;
  };

  const getPresenceStatus = (product: SatuProduct) => {
    const { presence, catalogPresence } = product.product;
    if (presence.isAvailable) return 'В наличии';
    if (presence.isOrderable) return 'Под заказ';
    if (presence.isWait) return 'Ожидается';
    return catalogPresence?.title || 'Нет в наличии';
  };

  const formatPrice = (price: number | null, currency: string) => {
    if (price === null) return 'Цена по запросу';
    return `${price.toLocaleString('ru-RU')} ${currency}`;
  };

  return (
    <div>
      <div className={styles.toolHeader}>
        <img src="/satu.svg" alt="Satu.kz" className={styles.toolIcon} />
        <span className={styles.toolTitle}>
          Поиск: "{toolInput.query}"
          {Number.isFinite(toolInput.price_lower_than) &&
            ` • ниже ${toolInput.price_lower_than!.toLocaleString('ru-RU')}`}
        </span>
      </div>

      <div className={styles.productsContainer}>
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeleton}>
                <div className={styles.skeletonImage} />
                <div className={styles.skeletonContent}>
                  <div className={`${styles.skeletonLine} ${styles.title}`} />
                  <div className={`${styles.skeletonLine} ${styles.price}`} />
                  <div className={`${styles.skeletonLine} ${styles.company}`} />
                </div>
              </div>
            ))}
          </>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : products.length === 0 ? (
          <div className={styles.error}>Товары не найдены</div>
        ) : (
          products.map((item) => (
            <div
              key={item.product.id}
              className={styles.productCard}
              onClick={() => setSelectedProduct(item)}
            >
              {item.product.image400x400 && (
                <img
                  src={item.product.image400x400}
                  alt={item.product.imageAlt || item.product.name}
                  className={styles.productImage}
                />
              )}
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{item.product.name}</h3>
                <div className={styles.productMeta}>
                  <div className={styles.productPrice}>
                    {formatPrice(item.product.price, item.product.priceCurrencyLocalized)}
                  </div>
                  <div className={styles.productCompany}>{item.product.company.name}</div>
                  <div className={styles.productStatus}>{getPresenceStatus(item)}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedProduct && (
        <SatuProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
