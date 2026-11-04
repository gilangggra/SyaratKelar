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
  requiresMaterai?: boolean; // Apakah dokumen ini membutuhkan Materai Rp10.000
  photocopyCopies?: number; // Jumlah salinan fotokopi yang disarankan (default: 2)
  requiresInPerson?: boolean; // Apakah menuntut kehadiran fisik langsung (misal biometrik)
  prerequisiteServiceSlug?: string; // Jika dokumen ini diterbitkan dari layanan lain di CekLayanan
  prerequisiteServiceLabel?: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  value: string;
}

export type RuleOperator = 'equals' | 'not_equals' | 'in';

export interface RuleCondition {
  questionId: string;
  operator: RuleOperator;
  value: string | string[];
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  helpText?: string;
  options: QuestionOption[];
  defaultValue?: string;
  /**
   * Jika diset, pertanyaan ini hanya ditampilkan apabila kondisi pertanyaan sebelumnya terpenuhi.
   */
  dependsOn?: RuleCondition | RuleCondition[];
}

export interface Rule {
  id: string;
  /**
   * Kondisi tunggal (backward-compatible)
   */
  questionId?: string;
  operator?: RuleOperator;
  value?: string | string[];
  /**
   * Multi-kondisi (AND / OR) untuk aturan yang bergantung pada lebih dari 1 pertanyaan
   */
  conditions?: RuleCondition[];
  matchType?: 'all' | 'any'; // default: 'all' (AND)
  /**
   * Label ringkas alasan mengapa aturan ini memicu persyaratan (ditampilkan di UI checklist)
   */
  reasonLabel?: string;
  /**
   * Daftar ID requirement yang aktif jika kondisi terpenuhi
   */
  requirementIds: string[];
  /**
   * Daftar ID base requirement yang dikecualikan/digantikan jika kondisi ini terpenuhi
   * (Contoh: Anak hanya dari Ibu Kandung menggantikan syarat KTP Kedua Orang Tua menjadi KTP Ibu Kandung saja)
   */
  excludeRequirementIds?: string[];
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
  keywords?: string[]; // Kata kunci pencarian kasus nyata masyarakat
  fees: FeeInfo;
  sources: SourceReference[];
  questions: Question[];
  rules: Rule[];
  baseRequirementIds: string[]; // Requirement yang selalu wajib secara default
  allRequirements: Requirement[];
  pitfalls?: ServicePitfall[];
  faqs?: ServiceFaq[];
  relatedServiceSlugs?: string[]; // Layanan terkait yang sering diurus bersamaan
}

export interface ServicePitfall {
  id: string;
  title: string;
  description: string;
  type?: 'warning' | 'caution' | 'info';
}

export interface ServiceFaq {
  id: string;
  question: string;
  answer: string;
}

export type UserAnswers = Record<string, string>;

export interface ChecklistState {
  serviceId: string;
  checkedRequirementIds: string[];
  lastUpdated: string;
}

export interface PreparationSummary {
  totalDocuments: number;
  mandatoryCount: number;
  conditionalCount: number;
  materaiCount: number;
  templatesAvailableCount: number;
  requiresInPerson: boolean;
  prerequisiteServices: {
    requirementId: string;
    requirementTitle: string;
    serviceSlug: string;
    serviceLabel: string;
  }[];
}

// === Life Event Bundles (Paket Peristiwa Kehidupan) ===
export interface LifeEventStep {
  order: number;
  serviceSlug: string;
  serviceName: string;
  roleDescription: string;
  presetAnswers?: UserAnswers;
}

export interface LifeEventBundle {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badgeText: string;
  steps: LifeEventStep[];
}

// === Template Generator Types ===
export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  options?: { label: string; value: string }[];
  section?: 'identitas' | 'pernyataan' | 'saksi';
}

export interface DocumentTemplate {
  id: string;
  slug: string;
  title: string;
  officialCode?: string; // Misal: "Formulir F-2.03"
  description: string;
  legalBasis: string;
  destinationAgency: string;
  requiresMaterai?: boolean;
  relatedServiceSlug?: string;
  statementIntro?: string;
  closingStatement?: string;
  fields: TemplateField[];
}
