import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Tender } from '../types/tender';

const ITEMS_PER_PAGE = 10;

export const useTenders = (query?: string, isActiveFilter?: boolean) => {
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
      });

      setTenders(response.result);
      setTotal(response.total);
      setHasMore(response.result.length < response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tenders');
    } finally {
      setLoading(false);
    }
  }, [query, isActiveFilter]);

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
      });

      setTenders((prev) => [...prev, ...response.result]);
      setHasMore(tenders.length + response.result.length < response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more tenders');
    } finally {
      setLoading(false);
    }
  }, [tenders.length, hasMore, loading, query, isActiveFilter]);

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
