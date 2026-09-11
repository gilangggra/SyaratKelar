import { Service } from '@/types';
import { ktpService } from './items/ktp';
import { kartuKeluargaService } from './items/kartu-keluarga';
import { pindahDomisiliService } from './items/pindah-domisili';
import { aktaKelahiranService } from './items/akta-kelahiran';
import { aktaKematianService } from './items/akta-kematian';
import { skuService } from './items/sku';
import { sktmService } from './items/sktm';
import { suratAhliWarisService } from './items/surat-ahli-waris';

// Map of all 8 fully configured administrative services
const SERVICES_MAP: Record<string, Service> = {
  ktp: ktpService,
  'kartu-keluarga': kartuKeluargaService,
  'pindah-domisili': pindahDomisiliService,
  'akta-kelahiran': aktaKelahiranService,
  'akta-kematian': aktaKematianService,
  sku: skuService,
  sktm: sktmService,
  'surat-ahli-waris': suratAhliWarisService,
};

/**
 * Mendapatkan konfigurasi layanan lengkap berdasarkan slug
 */
export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES_MAP[slug];
}

/**
 * Mendapatkan konfigurasi layanan lengkap berdasarkan ID
 */
export function getServiceById(id: string): Service | undefined {
  return SERVICES_MAP[id];
}

/**
 * Memeriksa apakah suatu layanan telah memiliki konfigurasi rule engine penuh
 */
export function isServiceConfigured(slug: string): boolean {
  return Boolean(SERVICES_MAP[slug]);
}

/**
 * Mendapatkan daftar seluruh slug layanan yang sudah siap digunakan
 */
export function getConfiguredServiceSlugs(): string[] {
  return Object.keys(SERVICES_MAP);
}

/**
 * Mendapatkan daftar seluruh objek layanan lengkap
 */
export function getAllConfiguredServices(): Service[] {
  return Object.values(SERVICES_MAP);
}
