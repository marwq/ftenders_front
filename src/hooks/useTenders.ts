import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Tender } from '../types/tender';

const ITEMS_PER_PAGE = 10;

export const useTenders = (query?: string, isActiveFilter?: boolean, priceFrom?: number, priceTo?: number) => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const loadInitialTenders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.fetchTenders({
        limit: ITEMS_PER_PAGE,
        offset: 0,
        query,
        is_active: isActiveFilter,
        price_from: priceFrom,
        price_to: priceTo,
      });

      setTenders(response.result);
      setTotal(response.total);
      setHasMore(response.result.length < response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tenders');
    } finally {
      setLoading(false);
    }
  }, [query, isActiveFilter, priceFrom, priceTo]);

  const loadMoreTenders = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.fetchTenders({
        limit: ITEMS_PER_PAGE,
        offset: tenders.length,
        query,
        is_active: isActiveFilter,
        price_from: priceFrom,
        price_to: priceTo,
      });

      setTenders((prev) => [...prev, ...response.result]);
      setHasMore(tenders.length + response.result.length < response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more tenders');
    } finally {
      setLoading(false);
    }
  }, [tenders.length, hasMore, loading, query, isActiveFilter, priceFrom, priceTo]);

  useEffect(() => {
    loadInitialTenders();
  }, [loadInitialTenders]);

  return {
    tenders,
    loading,
    error,
    hasMore,
    total,
    loadMoreTenders,
    reload: loadInitialTenders,
  };
};
