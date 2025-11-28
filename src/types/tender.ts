export interface Tender {
  _id: string;
  announcement: Announcement;
  is_active: boolean;
}

export interface Announcement {
  id: number;
  external_id: number;
  announcement_number: string;
  name: string;
  publish_date: number;
  offer_start_date: number;
  offer_end_date: number;
  discussion_start_date: number | null;
  discussion_end_date: number | null;
  repeated_offer_start_date: number | null;
  repeated_offer_end_date: number | null;
  results_publication_date: number | null;
  is_among_disabled: boolean;
  is_light_industry: boolean | null;
  timestamp: number;
  total_price: number;
  status: Status;
  year: number | null;
  purchase_type: PurchaseType;
  special_purchase_type: string | null;
  purchase_method: PurchaseMethod;
  purchase_subject: string | null;
  system: System;
  lot_count: number;
  organizer: Organizer;
  customer: Organizer | null;
  delivery_address: string | null;
  features: string[];
}

export interface Status {
  id: number;
  name: string;
  is_active: boolean;
  egz_code: string;
  mtw_code: string;
  skk_code: string;
}

export interface PurchaseType {
  id: number;
  code: string | null;
  name: string;
  egz_code: string;
  mtw_code: string | null;
  skk_code: string | null;
}

export interface PurchaseMethod {
  id: number;
  code: string | null;
  name: string;
  is_active: boolean;
  name_kk: string;
  name_ru: string;
  plan_type: string | null;
  egz_code: string;
  mtw_code: string | null;
  skk_code: string | null;
}

export interface System {
  id: number;
  name: string;
}

export interface Organizer {
  id: number;
  external_id: number;
  iin_bin: string;
  name: string;
  is_resident: boolean;
  timestamp: number;
  director: Director | null;
  address: Address;
  country_code: string | null;
  is_individual_entrepreneur: boolean;
  certificate_number: string;
  certificate_serial: string | null;
  is_small_business_entity: boolean;
  org_form: string;
  org_legal_form: string;
  property_form: string;
  registration_date: number;
  size: string;
  registration_number: string;
  rnn: string;
  short_name: string;
  planned_employees_count: number;
  personal_authorized_capital_amount: number;
  government_authorized_capital_amount: number;
  authorized_capital_amount: number;
  certificate_date: number;
  okpo: Okpo;
  organization_type: OrganizationType;
  gus: any[];
  budget_type: string | null;
  abp: string | null;
  code_gu: string | null;
}

export interface Director {
  id: number;
  iin: string;
  rnn: string;
  full_name: string;
  timestamp: number;
}

export interface Address {
  id: number;
  phone: string | null;
  city: string;
  zip: string;
  street: string;
  house: string;
  office: string;
  fax: string | null;
  _type: number;
  category_code: string | null;
  timestamp: number;
  kato: Kato;
  country: Country;
}

export interface Kato {
  id: number;
  code: string;
  name: string;
  name_ru: string;
  name_kk: string;
  full_name: string;
  full_name_ru: string;
  full_name_kk: string;
}

export interface Country {
  id: number;
  name: string;
  name_ru: string;
  name_kk: string;
  code: string | null;
  egz_code: string;
  mtw_code: string;
  skk_code: string;
}

export interface Okpo {
  id: number;
  code: string;
  name: string;
}

export interface OrganizationType {
  id: number;
  code: string | null;
  name: string;
  name_ru: string;
  name_kk: string;
  egz_code: string;
  mtw_code: string;
  skk_code: string | null;
}

export interface TenderListResponse {
  total: number;
  result: Tender[];
}
