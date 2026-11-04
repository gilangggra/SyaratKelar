import { getAllConfiguredServices, getServiceBySlug } from '../../data/services/registry';
import {
  resolveRequirements,
  getActiveQuestions,
  sanitizeAnswersForActiveQuestions,
} from './engine';

console.log('=== COMPREHENSIVE 8 SERVICES & RULE ENGINE V2 VERIFICATION TEST ===\n');

const allServices = getAllConfiguredServices();
console.log(`Total configured services found: ${allServices.length}`);

let hasErrors = false;

allServices.forEach((service) => {
  console.log(`\nTesting Service: [${service.name}] (${service.slug})`);

  // 1. Check basic integrity
  if (!service.id || !service.slug || !service.name) {
    console.error(`ERROR: Service missing required id/slug/name`);
    hasErrors = true;
  }

  // 2. Check base requirements
  const reqMap = new Map(service.allRequirements.map((r) => [r.id, r]));
  service.baseRequirementIds.forEach((baseId) => {
    if (!reqMap.has(baseId)) {
      console.error(
        `ERROR: baseRequirementId "${baseId}" not found in allRequirements of ${service.slug}`
      );
      hasErrors = true;
    }
  });

  // 3. Check rules and target requirement IDs + excludeRequirementIds
  service.rules.forEach((rule) => {
    rule.requirementIds.forEach((reqId) => {
      if (!reqMap.has(reqId)) {
        console.error(
          `ERROR: Rule target requirementId "${reqId}" not found in allRequirements of ${service.slug}`
        );
        hasErrors = true;
      }
    });
    (rule.excludeRequirementIds || []).forEach((exId) => {
      if (!reqMap.has(exId)) {
        console.error(
          `ERROR: Rule excludeRequirementId "${exId}" not found in allRequirements of ${service.slug}`
        );
        hasErrors = true;
      }
    });
  });

  // 4. Test execution of resolveRequirements with empty answers
  const emptyResult = resolveRequirements(service, {});
  if (emptyResult.mandatory.length !== service.baseRequirementIds.length) {
    console.error(
      `ERROR: Expected ${service.baseRequirementIds.length} mandatory, got ${emptyResult.mandatory.length}`
    );
    hasErrors = true;
  }

  // 5. Test execution with default values
  const defaultAnswers: Record<string, string> = {};
  service.questions.forEach((q) => {
    if (q.defaultValue) defaultAnswers[q.id] = q.defaultValue;
  });
  const sanitizedDefaults = sanitizeAnswersForActiveQuestions(service, defaultAnswers);
  const defaultResult = resolveRequirements(service, sanitizedDefaults);
  console.log(
    `- Default answers produce ${defaultResult.mandatory.length} mandatory & ${defaultResult.conditional.length} conditional items (Total: ${defaultResult.all.length}, Materai: ${defaultResult.preparationSummary.materaiCount})`
  );
});

// 6. Specific Scenario Assertions for Rule Engine v2
const aktaLahir = getServiceBySlug('akta-kelahiran')!;
const ibuKandungRes = resolveRequirements(aktaLahir, {
  bukti_kelahiran: 'tidak_ada_medis',
  status_perkawinan_ortu: 'ibu_kandung',
});
if (ibuKandungRes.all.some((r) => r.id === 'ktp_orang_tua')) {
  console.error('ERROR: akta-kelahiran ibu_kandung should exclude ktp_orang_tua');
  hasErrors = true;
}
if (!ibuKandungRes.all.some((r) => r.id === 'ktp_ibu_kandung_saja')) {
  console.error('ERROR: akta-kelahiran ibu_kandung should include ktp_ibu_kandung_saja');
  hasErrors = true;
}

const kkService = getServiceBySlug('kartu-keluarga')!;
const kkActiveForMenikah = getActiveQuestions(kkService, { keperluan_kk: 'menikah_baru' });
const kkActiveForUbahData = getActiveQuestions(kkService, { keperluan_kk: 'ubah_elemen_data' });
if (kkActiveForMenikah.length !== 1 || kkActiveForUbahData.length !== 2) {
  console.error(
    `ERROR: Dynamic question branching failed for KK (menikah: ${kkActiveForMenikah.length}, ubah_data: ${kkActiveForUbahData.length})`
  );
  hasErrors = true;
}

if (hasErrors) {
  console.error('\nFAILED: Some services or rule engine assertions failed.');
  process.exit(1);
} else {
  console.log('\nSUCCESS: All 8 services and Rule Engine v2 assertions passed!');
}
