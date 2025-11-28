export interface Company {
  name_ru: string;
  bin: string;
  form?: string;
  state?: string;
  registration_date?: string;
  director?: string;
  locality_ru?: string;
  legal_address?: string;
  activity_ru?: string;
  OKED_main_code?: string;
  OKED_addition_codes?: string[];
  KRP_code?: string;
  KRP_name_ru?: string;
  KSE_code?: string;
  KSE_name_ru?: string;
  KFS_code?: string;
  KFS_name_ru?: string;
  KATO_code?: string;
  KATO_name?: string;
  sector?: string;
  last_update_gov_date?: string;
  views?: number;
  zakup?: {
    number_reg?: string;
    mark_resident?: boolean;
    mark_national_company?: boolean;
    supplier?: boolean;
    customer?: boolean;
    organizer?: boolean;
    mark_state_monopoly?: boolean;
    bank?: any[];
  };
  branches?: Array<{
    bin: string;
    name_ru: string;
    status: string;
  }>;
  similar?: {
    by_address?: {
      total: number;
      total_search: number;
      result: Array<{
        name_ru: string;
        bin: string;
        director: string;
        legal_address: string;
      }>;
    };
    by_director?: {
      total: number;
      total_search: number;
      result: Array<{
        name_ru: string;
        bin: string;
      }>;
    };
  };
}

export interface CompanyContacts {
  email?: string;
  website?: string;
  phones?: string[];
}

export interface CompanyRisks {
  total_risks: number;
  company: {
    courts?: Array<{
      number: string;
      type: string;
    }>;
    violation?: any[];
    arrears?: any[];
    bankruptcy?: any[];
    inactive?: any[];
  };
  director: {
    wrong_address?: Array<{
      bin: string;
      director: string;
      number: string;
      date: string;
    }>;
    bankruptcy?: any[];
  };
}

export interface CourtCase {
  number: string;
  date: string;
  type: string;
  plaintiff: string;
  defendant: string;
  judge: string;
  claims?: string[];
  results?: string[];
  tsv?: string;
}

export interface CompanyLicenses {
  total_count: number;
  licenses: any[];
}

export interface CompanyDetails {
  bin: string;
  company: Company;
  contacts?: CompanyContacts;
  risks?: CompanyRisks;
  courts?: {
    company: CourtCase[];
  };
  licenses?: CompanyLicenses;
}

export interface CompanySearchResponse {
  result: Company[];
}
