export interface Lot {
  id: number;
  lot_number: number;
  name: string | null;
  description: string | null;
  status: LotStatus;
  system: System;
  is_combined: boolean;
  is_dumping: boolean;
  dumping_price: number | null;
  is_consulting_service: boolean;
  is_externally_deleted: boolean;
  psd_sign: number | null;
  total_price: number;
  purchase_method: PurchaseMethod | null;
  purchase_subject: PurchaseSubject | null;
  enstru: Enstru | null;
  organization: Organization | null;
  plan_items?: PlanItem[];
}

export interface LotStatus {
  id: number;
  name: string;
  egz_code: string;
}

export interface System {
  id: number;
  name: string;
}

export interface PurchaseMethod {
  id: number;
  name: string;
}

export interface PurchaseSubject {
  id: number;
  name: string;
}

export interface Enstru {
  code: string;
  name: string;
  short_description: string | null;
  is_krbs: boolean;
  is_disabled_people: boolean;
  is_smr: boolean;
}

export interface Organization {
  iin_bin: string;
  name: string;
}

export interface PlanItem {
  id: number;
  description: string;
  extra_description: string | null;
  count: number;
  measure: Measure | null;
  unit_price: number;
  total_price: number;
  total_price_year_1: number;
  total_price_year_2: number;
  total_price_year_3: number;
  prepayment: number;
  status: PlanItemStatus;
  month: Month | null;
  decree_date: number | null;
  purchase_limitation_sign: string;
  is_externally_deleted: boolean;
  is_externally_active: boolean;
  is_quasi_sector: boolean;
  delivery_deadline_ru: string | null;
  delivery_address: string | null;
  delivery_condition: string | null;
  funding_source: string | null;
  budget_type: string | null;
  extra_info: string | null;
  enstru: Enstru | null;
  organization: Organization;
  files: any[] | null;
}

export interface Measure {
  name: string;
  egz_code: string;
  alpha_code: string;
}

export interface PlanItemStatus {
  name: string;
}

export interface Month {
  name: string;
}

export interface FileGroup {
  group: FileGroupInfo;
  is_require_suppliers: boolean;
  files: TenderFile[] | null;
}

export interface FileGroupInfo {
  id?: number;
  name: string;
  category: FileCategory;
  egz_code: string;
  is_require_subjects: boolean;
  is_visible_suppliers: boolean;
  is_visible_subjects: boolean;
  template_file: TemplateFile | null;
  mtw_code?: string | null;
  skk_code?: string | null;
}

export interface FileCategory {
  id?: number;
  name: string;
  name_ru?: string;
  name_kk?: string;
  egz_code?: string;
  mtw_code?: string | null;
  skk_code?: string | null;
}

export interface TemplateFile {
  id?: number;
  name: string;
  name_ru?: string;
  name_kk?: string | null;
  filename?: string;
  file_url: string;
  egz_code?: string;
  mtw_code?: string | null;
  skk_code?: string | null;
}

export interface TenderFile {
  id: number;
  name: string | null;
  original_name: string | null;
  lot_number: number | null;
  organizer: Organization;
  category: FileCategory;
  group: FileGroupInfo;
  file: FileInfo;
}

export interface FileInfo {
  file_url: string;
  filename: string | null;
  uuid: string;
  timestamp: number;
  validation_status: ValidationStatus;
}

export interface ValidationStatus {
  signature: ValidationCheck;
  av: ValidationCheck;
  final: string;
}

export interface ValidationCheck {
  text: string;
  check: boolean;
}

export interface TenderDetails {
  _id: string;
  announcement: any; // Используем существующий тип
  is_active: boolean;
  lots?: Lot[];
  general_files?: FileGroup[];
}
