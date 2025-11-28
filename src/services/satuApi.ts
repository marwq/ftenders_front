import type { SatuSearchResponse, SatuProductDetails } from '../types/satuProduct';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const satuApi = {
  async searchProducts(query: string, page: number = 1): Promise<SatuSearchResponse> {
    const url = `${API_BASE_URL}/product/satu/?query=${encodeURIComponent(query)}&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`);
    }

    return response.json();
  },

  async getProductDetails(productId: number): Promise<SatuProductDetails> {
    const url = `${API_BASE_URL}/product/satu/${productId}/details`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch product details: ${response.statusText}`);
    }

    return response.json();
  },
};
