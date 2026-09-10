import { ktpService } from '../../data/services/items/ktp';
import { kartuKeluargaService } from '../../data/services/items/kartu-keluarga';
import { resolveRequirements } from './engine';

console.log('=== TESTING RULE ENGINE SCENARIOS ===\n');

// 1. Test KTP: Scenario A (Pembuatan Baru + Domisili Asal)
const resultKtpBaru = resolveRequirements(ktpService, {
  alasan_pengurusan: 'baru',
  lokasi_pengurusan: 'domisili_asal',
});
console.log('Scenario A (KTP Baru, Domisili Asal):');
console.log('- Base mandatory:', resultKtpBaru.mandatory.map(r => r.id));
console.log('- Conditional:', resultKtpBaru.conditional.map(r => r.id));
const hasBiometrik = resultKtpBaru.all.some(r => r.id === 'perekaman_biometrik');
const hasLuarDomisili = resultKtpBaru.all.some(r => r.id === 'surat_permohonan_luar_domisili');
console.log('Assert has perekaman_biometrik:', hasBiometrik ? 'PASS' : 'FAIL');
console.log('Assert NO luar domisili:', !hasLuarDomisili ? 'PASS' : 'FAIL');

// 2. Test KTP: Scenario B (KTP Hilang + Luar Domisili) -> Kombinasi Multiple Rules
const resultKtpHilangLuar = resolveRequirements(ktpService, {
  alasan_pengurusan: 'hilang',
  lokasi_pengurusan: 'luar_domisili',
});
console.log('\nScenario B (KTP Hilang, Luar Domisili):');
const hasKehilangan = resultKtpHilangLuar.all.some(r => r.id === 'surat_kehilangan_polisi');
const hasLuar = resultKtpHilangLuar.all.some(r => r.id === 'surat_permohonan_luar_domisili');
const noBiometrik = !resultKtpHilangLuar.all.some(r => r.id === 'perekaman_biometrik');
console.log('Assert has surat_kehilangan_polisi:', hasKehilangan ? 'PASS' : 'FAIL');
console.log('Assert has surat_permohonan_luar_domisili:', hasLuar ? 'PASS' : 'FAIL');
console.log('Assert NO perekaman_biometrik:', noBiometrik ? 'PASS' : 'FAIL');

// 3. Test KK: Scenario C (Pecah KK Menikah)
const resultKkMenikah = resolveRequirements(kartuKeluargaService, {
  keperluan_kk: 'menikah_baru',
});
console.log('\nScenario C (KK Pecah Menikah):');
const hasBukuNikah = resultKkMenikah.all.some(r => r.id === 'buku_nikah_perkawinan');
const hasKkOrtu = resultKkMenikah.all.some(r => r.id === 'kk_lama_kedua_orangtua');
console.log('Assert has buku_nikah_perkawinan:', hasBukuNikah ? 'PASS' : 'FAIL');
console.log('Assert has kk_lama_kedua_orangtua:', hasKkOrtu ? 'PASS' : 'FAIL');

// 4. Test Missing Answers & Edge Cases
console.log('\nScenario D (Edge Cases: Empty Answers & Missing Rules):');
const resultEmpty = resolveRequirements(ktpService, {});
console.log('Assert empty answers only returns base mandatory:', resultEmpty.all.length === 1 ? 'PASS' : 'FAIL');

console.log('\n=== ALL SCENARIOS COMPLETED SUCCESSFULLY ===');
