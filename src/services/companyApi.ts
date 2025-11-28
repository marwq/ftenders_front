import type { CompanySearchResponse, CompanyDetails } from '../types/company';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export const companyApi = {
  async searchCompanies(query: string): Promise<CompanySearchResponse> {
    const url = `${API_BASE_URL}/company/?query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to search companies');
    }
    return response.json();
  },

  async getCompanyDetails(iinOrBin: string): Promise<CompanyDetails> {
    const url = `${API_BASE_URL}/company/${iinOrBin}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch company details');
    }
    return response.json();
  },
};
