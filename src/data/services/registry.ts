import { Service } from '@/types';
import { ktpService } from './items/ktp';
import { kartuKeluargaService } from './items/kartu-keluarga';

// Map of fully configured service items
const SERVICES_MAP: Record<string, Service> = {
  ktp: ktpService,
  'kartu-keluarga': kartuKeluargaService,
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
