import {
  Service,
  Rule,
  RuleCondition,
  Question,
  Requirement,
  UserAnswers,
  PreparationSummary,
} from '@/types';

/**
 * Mengevaluasi satu kondisi atomik terhadap jawaban pengguna
 */
export function evaluateSingleCondition(
  condition: RuleCondition,
  answers: UserAnswers
): boolean {
  const userAnswer = answers[condition.questionId];

  if (userAnswer === undefined || userAnswer === null) {
    return false;
  }

  switch (condition.operator) {
    case 'equals':
      return userAnswer === condition.value;

    case 'not_equals':
      return userAnswer !== condition.value;

    case 'in':
      if (Array.isArray(condition.value)) {
        return condition.value.includes(userAnswer);
      }
      return false;

    default:
      return false;
  }
}

/**
 * Memeriksa apakah suatu Question aktif (harus ditampilkan) berdasarkan dependsOn dan jawaban saat ini
 */
export function isQuestionActive(
  question: Question,
  answers: UserAnswers
): boolean {
  if (!question.dependsOn) {
    return true;
  }

  const dependencies = Array.isArray(question.dependsOn)
    ? question.dependsOn
    : [question.dependsOn];

  return dependencies.every((dep) => evaluateSingleCondition(dep, answers));
}

/**
 * Mengembalikan daftar pertanyaan yang aktif berdasarkan jawaban pengguna saat ini
 */
export function getActiveQuestions(
  service: Service,
  answers: UserAnswers
): Question[] {
  if (!service || !Array.isArray(service.questions)) {
    return [];
  }

  const active: Question[] = [];
  const effectiveAnswers: UserAnswers = {};

  for (const question of service.questions) {
    if (isQuestionActive(question, effectiveAnswers)) {
      active.push(question);
      if (answers[question.id] !== undefined) {
        effectiveAnswers[question.id] = answers[question.id];
      } else if (question.defaultValue !== undefined) {
        effectiveAnswers[question.id] = question.defaultValue;
      }
    }
  }

  return active;
}

/**
 * Membersihkan jawaban untuk pertanyaan yang tidak lagi aktif akibat perubahan jawaban di langkah sebelumnya
 */
export function sanitizeAnswersForActiveQuestions(
  service: Service,
  answers: UserAnswers
): UserAnswers {
  const activeQuestions = getActiveQuestions(service, answers);
  const activeIds = new Set(activeQuestions.map((q) => q.id));

  const sanitized: UserAnswers = {};
  for (const q of activeQuestions) {
    const val = answers[q.id];
    const isValidOption = q.options.some((opt) => opt.value === val);
    if (val && isValidOption && activeIds.has(q.id)) {
      sanitized[q.id] = val;
    } else if (q.defaultValue) {
      sanitized[q.id] = q.defaultValue;
    }
  }

  return sanitized;
}

/**
 * Mengevaluasi apakah suatu Rule terpenuhi berdasarkan jawaban pengguna.
 * Mendukung baik format kondisi tunggal (questionId, operator, value)
 * maupun multi-kondisi (conditions[] dengan matchType 'all' | 'any').
 */
export function evaluateCondition(rule: Rule, answers: UserAnswers): boolean {
  // Multi-condition evaluation
  if (rule.conditions && Array.isArray(rule.conditions) && rule.conditions.length > 0) {
    const matchType = rule.matchType || 'all';
    if (matchType === 'any') {
      return rule.conditions.some((cond) => evaluateSingleCondition(cond, answers));
    }
    return rule.conditions.every((cond) => evaluateSingleCondition(cond, answers));
  }

  // Single-condition evaluation (backward compatible)
  if (rule.questionId && rule.operator && rule.value !== undefined) {
    return evaluateSingleCondition(
      {
        questionId: rule.questionId,
        operator: rule.operator,
        value: rule.value,
      },
      answers
    );
  }

  return false;
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

/**
 * Menghasilkan label alasan otomatis untuk suatu Rule yang cocok berdasarkan pertanyaan dan opsi yang dipilih
 */
function buildRuleReasonText(
  rule: Rule,
  service: Service,
  answers: UserAnswers
): string | null {
  if (rule.reasonLabel) {
    return rule.reasonLabel;
  }

  const qMap = new Map<string, Question>();
  for (const q of service.questions || []) {
    qMap.set(q.id, q);
  }

  const conditionsToDescribe: RuleCondition[] =
    rule.conditions && rule.conditions.length > 0
      ? rule.conditions
      : rule.questionId && rule.operator && rule.value !== undefined
      ? [{ questionId: rule.questionId, operator: rule.operator, value: rule.value }]
      : [];

  const labels: string[] = [];
  for (const cond of conditionsToDescribe) {
    const q = qMap.get(cond.questionId);
    const ansVal = answers[cond.questionId];
    if (q && ansVal) {
      const opt = q.options.find((o) => o.value === ansVal);
      if (opt) {
        labels.push(opt.label);
      }
    }
  }

  return labels.length > 0 ? labels.join(' & ') : null;
}

export interface ResolvedRequirementsResult {
  mandatory: Requirement[];
  conditional: Requirement[];
  all: Requirement[];
  matchedRuleIds: string[];
  excludedRequirementIds: string[];
  reasonsByRequirementId: Record<string, string[]>;
  preparationSummary: PreparationSummary;
}

/**
 * Requirement Resolver v2
 * Menggabungkan base requirements (selalu wajib kecuali di-exclude oleh aturan khusus)
 * dengan persyaratan kondisional hasil evaluasi jawaban pada pertanyaan aktif,
 * sekaligus menyusun penjelasan alasan (explainability) dan ringkasan persiapan fisik.
 */
export function resolveRequirements(
  service: Service,
  rawAnswers: UserAnswers
): ResolvedRequirementsResult {
  const emptySummary: PreparationSummary = {
    totalDocuments: 0,
    mandatoryCount: 0,
    conditionalCount: 0,
    materaiCount: 0,
    templatesAvailableCount: 0,
    requiresInPerson: false,
    prerequisiteServices: [],
  };

  if (!service) {
    return {
      mandatory: [],
      conditional: [],
      all: [],
      matchedRuleIds: [],
      excludedRequirementIds: [],
      reasonsByRequirementId: {},
      preparationSummary: emptySummary,
    };
  }

  // Filter hanya jawaban dari pertanyaan yang aktif (jika ada pertanyaan yang sudah dijawab)
  const hasAnyAnswers = Object.keys(rawAnswers || {}).length > 0;
  const activeQuestions = getActiveQuestions(service, rawAnswers || {});
  const activeQuestionIds = new Set(activeQuestions.map((q) => q.id));

  const effectiveAnswers: UserAnswers = {};
  if (hasAnyAnswers) {
    for (const [k, v] of Object.entries(rawAnswers)) {
      if (activeQuestionIds.has(k)) {
        effectiveAnswers[k] = v;
      }
    }
  }

  // 1. Evaluasi rules yang aktif
  const conditionalReqIds = new Set<string>();
  const excludedReqIds = new Set<string>();
  const matchedRuleIds: string[] = [];
  const reasonsByRequirementId: Record<string, string[]> = {};

  for (const rule of service.rules || []) {
    if (evaluateCondition(rule, effectiveAnswers)) {
      matchedRuleIds.push(rule.id);
      const reasonText = buildRuleReasonText(rule, service, effectiveAnswers);

      for (const reqId of rule.requirementIds) {
        conditionalReqIds.add(reqId);
        if (reasonText) {
          if (!reasonsByRequirementId[reqId]) {
            reasonsByRequirementId[reqId] = [];
          }
          if (!reasonsByRequirementId[reqId].includes(reasonText)) {
            reasonsByRequirementId[reqId].push(reasonText);
          }
        }
      }

      if (rule.excludeRequirementIds) {
        for (const exId of rule.excludeRequirementIds) {
          excludedReqIds.add(exId);
        }
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

  // Base requirements yang selalu wajib (kecuali digantikan oleh excludeRequirementIds)
  for (const baseId of service.baseRequirementIds || []) {
    if (excludedReqIds.has(baseId)) {
      continue;
    }
    const req = reqMap.get(baseId);
    if (req && !processedIds.has(baseId)) {
      mandatoryList.push(req);
      processedIds.add(baseId);
    }
  }

  // Dokumen kondisional yang terpicu oleh jawaban kondisi pengguna
  for (const condId of conditionalReqIds) {
    if (excludedReqIds.has(condId)) {
      continue;
    }
    const req = reqMap.get(condId);
    if (req && !processedIds.has(condId)) {
      if (req.isMandatory) {
        mandatoryList.push(req);
      } else {
        conditionalList.push(req);
      }
      processedIds.add(condId);
    }
  }

  const allResolved = [...mandatoryList, ...conditionalList];

  // 4. Hitung ringkasan persiapan fisik (PreparationSummary)
  let materaiCount = 0;
  let templatesAvailableCount = 0;
  let requiresInPerson = false;
  const prerequisiteServices: PreparationSummary['prerequisiteServices'] = [];

  for (const req of allResolved) {
    const needsMaterai =
      req.requiresMaterai ??
      (req.title.toLowerCase().includes('materai') ||
        req.title.toLowerCase().includes('sptjm') ||
        (req.description?.toLowerCase().includes('materai') ?? false));

    if (needsMaterai) {
      materaiCount += 1;
    }

    if (req.templateAvailable && req.templateId) {
      templatesAvailableCount += 1;
    }

    if (
      req.requiresInPerson ||
      req.id.includes('biometrik') ||
      req.title.toLowerCase().includes('hadir langsung')
    ) {
      requiresInPerson = true;
    }

    if (req.prerequisiteServiceSlug && req.prerequisiteServiceLabel) {
      prerequisiteServices.push({
        requirementId: req.id,
        requirementTitle: req.title,
        serviceSlug: req.prerequisiteServiceSlug,
        serviceLabel: req.prerequisiteServiceLabel,
      });
    }
  }

  return {
    mandatory: mandatoryList,
    conditional: conditionalList,
    all: allResolved,
    matchedRuleIds,
    excludedRequirementIds: Array.from(excludedReqIds),
    reasonsByRequirementId,
    preparationSummary: {
      totalDocuments: allResolved.length,
      mandatoryCount: mandatoryList.length,
      conditionalCount: conditionalList.length,
      materaiCount,
      templatesAvailableCount,
      requiresInPerson,
      prerequisiteServices,
    },
  };
}
