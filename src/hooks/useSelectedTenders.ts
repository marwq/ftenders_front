import { useState, useCallback } from 'react';

export const useSelectedTenders = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleTender = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectOnly = useCallback((id: string) => {
    setSelectedIds(new Set([id]));
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    toggleTender,
    clearSelection,
    selectOnly,
    isSelected,
  };
};
