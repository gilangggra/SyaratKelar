/**
 * CekLayanan Core Types
 */

export type ServiceCategory =
  | 'kependudukan'
  | 'pencatatan_sipil'
  | 'keterangan_kelurahan';

export interface SourceReference {
  title: string;
  sourceName: string;
  sourceUrl?: string;
  verifiedAt: string; // ISO date format or 'NEEDS_VERIFICATION'
  legalBasis?: string; // Dasar hukum, misal UU No. 24 Tahun 2013
}

export interface FeeInfo {
  isFree: boolean;
  officialAmount: number;
  currency: 'IDR';
  description: string;
  legalReference?: string;
}

export interface Requirement {
  id: string;
  title: string;
  description?: string;
  isMandatory: boolean; // Dokumen wajib atau kondisional
  notes?: string;
  templateAvailable?: boolean;
  templateId?: string;
}

export type QuestionOption = {
  id: string;
  label: string;
  description?: string;
  value: string;
};

export interface Question {
  id: string;
  title: string;
  description?: string;
  options: QuestionOption[];
  defaultValue?: string;
}

export type RuleOperator = 'equals' | 'not_equals' | 'in';

export interface Rule {
  id: string;
  questionId: string;
  operator: RuleOperator;
  value: string | string[];
  requirementIds: string[]; // Requirement ID yang harus ditampilkan jika kondisi terpenuhi
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: ServiceCategory;
  destinationAgency: string; // Misal: "Kantor Dukcapil", "Kelurahan / Kecamatan"
  estimatedTime?: string;
  fees: FeeInfo;
  sources: SourceReference[];
  questions: Question[];
  rules: Rule[];
  baseRequirementIds: string[]; // Requirement yang selalu wajib tanpa memandang jawaban
  allRequirements: Requirement[];
}

export type UserAnswers = Record<string, string>;

export interface ChecklistState {
  serviceId: string;
  checkedRequirementIds: string[];
  lastUpdated: string;
}
