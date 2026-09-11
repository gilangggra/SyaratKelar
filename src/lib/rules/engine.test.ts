import { getAllConfiguredServices } from '../../data/services/registry';
import { resolveRequirements } from './engine';

console.log('=== COMPREHENSIVE 8 SERVICES VERIFICATION TEST ===\n');

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
      console.error(`ERROR: baseRequirementId "${baseId}" not found in allRequirements of ${service.slug}`);
      hasErrors = true;
    }
  });

  // 3. Check rules and target requirement IDs
  service.rules.forEach((rule) => {
    rule.requirementIds.forEach((reqId) => {
      if (!reqMap.has(reqId)) {
        console.error(`ERROR: Rule target requirementId "${reqId}" not found in allRequirements of ${service.slug}`);
        hasErrors = true;
      }
    });
  });

  // 4. Test execution of resolveRequirements with empty answers
  const emptyResult = resolveRequirements(service, {});
  if (emptyResult.mandatory.length !== service.baseRequirementIds.length) {
    console.error(`ERROR: Expected ${service.baseRequirementIds.length} mandatory, got ${emptyResult.mandatory.length}`);
    hasErrors = true;
  }

  // 5. Test execution with default values
  const defaultAnswers: Record<string, string> = {};
  service.questions.forEach((q) => {
    if (q.defaultValue) defaultAnswers[q.id] = q.defaultValue;
  });
  const defaultResult = resolveRequirements(service, defaultAnswers);
  console.log(`- Default answers produce ${defaultResult.mandatory.length} mandatory & ${defaultResult.conditional.length} conditional items (Total: ${defaultResult.all.length})`);
});

if (hasErrors) {
  console.error('\nFAILED: Some services have broken requirement ID references.');
  process.exit(1);
} else {
  console.log('\nSUCCESS: All 8 services passed data integrity and rule engine tests!');
}
