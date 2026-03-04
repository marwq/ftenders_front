import type { TenderListResponse, Tender } from '../types/tender';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export interface FetchTendersParams {
  limit?: number;
  offset?: number;
  is_active?: boolean;
  query?: string;
  price_from?: number;
  price_to?: number;
}

export const api = {
  async fetchTenders(params: FetchTendersParams = {}): Promise<TenderListResponse> {
    const searchParams = new URLSearchParams();

    if (params.limit !== undefined) searchParams.set('limit', params.limit.toString());
    if (params.offset !== undefined) searchParams.set('offset', params.offset.toString());
    if (params.is_active !== undefined) searchParams.set('is_active', params.is_active.toString());
    if (params.price_from !== undefined) searchParams.set('price_from', params.price_from.toString());
    if (params.price_to !== undefined) searchParams.set('price_to', params.price_to.toString());

    // Only send query if it has non-whitespace characters after trimming
    const trimmedQuery = params.query?.trim();
    if (trimmedQuery) searchParams.set('query', trimmedQuery);

    const url = `${API_BASE_URL}/tender/?${searchParams.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch tenders: ${response.statusText}`);
    }

    return response.json();
  },

  async fetchTenderById(id: string): Promise<Tender> {
    const url = `${API_BASE_URL}/tender/${id}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch tender: ${response.statusText}`);
    }

    return response.json();
  },
};
