/**
 * CekLayanan Core Types
 */

export type ServiceCategory =
  | 'kependudukan'
  | 'pencatatan_sipil'
  | 'keterangan_kelurahan';

export interface SourceReference {
  id: string;
  title: string;
  sourceName: string;
  sourceUrl?: string;
  verifiedAt: string; // ISO Date YYYY-MM-DD atau 'NEEDS_VERIFICATION'
  legalBasis?: string; // Regulasi resmi, misal: "UU No. 24 Tahun 2013 Pasal 79A"
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
  isMandatory: boolean; // Dokumen wajib dasar vs kondisional/situasional
  notes?: string;
  templateAvailable?: boolean;
  templateId?: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  value: string;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  helpText?: string;
  options: QuestionOption[];
  defaultValue?: string;
}

export type RuleOperator = 'equals' | 'not_equals' | 'in';

export interface Rule {
  id: string;
  questionId: string;
  operator: RuleOperator;
  value: string | string[];
  requirementIds: string[]; // Daftar ID requirement yang aktif jika kondisi terpenuhi
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription?: string;
  category: ServiceCategory;
  categoryLabel: string;
  destinationAgency: string; // Misal: "Disdukcapil / Kecamatan"
  estimatedTime?: string; // Misal: "1 - 3 hari kerja (sesuai ketentuan daerah)"
  fees: FeeInfo;
  sources: SourceReference[];
  questions: Question[];
  rules: Rule[];
  baseRequirementIds: string[]; // Requirement yang selalu wajib
  allRequirements: Requirement[];
}

export type UserAnswers = Record<string, string>;

export interface ChecklistState {
  serviceId: string;
  checkedRequirementIds: string[];
  lastUpdated: string;
}
