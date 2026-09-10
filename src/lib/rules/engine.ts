import { Service, Rule, Requirement, UserAnswers } from '@/types';

/**
 * Mengevaluasi apakah suatu Rule terpenuhi berdasarkan jawaban pengguna
 */
export function evaluateCondition(rule: Rule, answers: UserAnswers): boolean {
  const userAnswer = answers[rule.questionId];

  // Jika pertanyaan belum dijawab, rule tidak aktif
  if (userAnswer === undefined || userAnswer === null) {
    return false;
  }

  switch (rule.operator) {
    case 'equals':
      return userAnswer === rule.value;

    case 'not_equals':
      return userAnswer !== rule.value;

    case 'in':
      if (Array.isArray(rule.value)) {
        return rule.value.includes(userAnswer);
      }
      return false;

    default:
      return false;
  }
}

/**
 * Mengevaluasi seluruh rules pada suatu layanan dan mengembalikan kumpulan ID requirement yang lolos seleksi
 */
export function evaluateRules(rules: Rule[], answers: UserAnswers): string[] {
  if (!rules || !Array.isArray(rules)) {
    return [];
  }

  const matchedRequirementIds = new Set<string>();

  for (const rule of rules) {
    if (evaluateCondition(rule, answers)) {
      for (const reqId of rule.requirementIds) {
        matchedRequirementIds.add(reqId);
      }
    }
  }

  return Array.from(matchedRequirementIds);
}

export interface ResolvedRequirementsResult {
  mandatory: Requirement[];
  conditional: Requirement[];
  all: Requirement[];
  matchedRuleIds: string[];
}

/**
 * Requirement Resolver
 * Menggabungkan base requirements (selalu wajib) dengan persyaratan kondisional hasil evaluasi jawaban
 */
export function resolveRequirements(
  service: Service,
  answers: UserAnswers
): ResolvedRequirementsResult {
  if (!service) {
    return { mandatory: [], conditional: [], all: [], matchedRuleIds: [] };
  }

  // 1. Dapatkan requirement IDs dari rules yang cocok
  const conditionalReqIds = new Set<string>();
  const matchedRuleIds: string[] = [];

  for (const rule of service.rules || []) {
    if (evaluateCondition(rule, answers)) {
      matchedRuleIds.push(rule.id);
      for (const reqId of rule.requirementIds) {
        conditionalReqIds.add(reqId);
      }
    }
  }

  // 2. Map requirement ID ke objek Requirement utuh
  const reqMap = new Map<string, Requirement>();
  for (const req of service.allRequirements || []) {
    reqMap.set(req.id, req);
  }

  // 3. Kelompokkan Dokumen Wajib Dasar vs Dokumen Kondisional Terpilih
  const mandatoryList: Requirement[] = [];
  const conditionalList: Requirement[] = [];
  const processedIds = new Set<string>();

  // Base requirements yang selalu wajib
  for (const baseId of service.baseRequirementIds || []) {
    const req = reqMap.get(baseId);
    if (req && !processedIds.has(baseId)) {
      mandatoryList.push(req);
      processedIds.add(baseId);
    }
  }

  // Dokumen kondisional yang terpicu oleh jawaban kondisi pengguna
  for (const condId of conditionalReqIds) {
    const req = reqMap.get(condId);
    if (req && !processedIds.has(condId)) {
      // Bila requirement kondisional ditandai wajib di data, masukkan ke mandatory
      if (req.isMandatory) {
        mandatoryList.push(req);
      } else {
        conditionalList.push(req);
      }
      processedIds.add(condId);
    }
  }

  return {
    mandatory: mandatoryList,
    conditional: conditionalList,
    all: [...mandatoryList, ...conditionalList],
    matchedRuleIds,
  };
}
