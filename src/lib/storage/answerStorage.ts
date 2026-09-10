import { UserAnswers } from '@/types';

const STORAGE_PREFIX = 'ceklayanan_answers_';

export function saveUserAnswers(serviceId: string, answers: UserAnswers): void {
  if (typeof window === 'undefined') return;

  try {
    const key = `${STORAGE_PREFIX}${serviceId}`;
    sessionStorage.setItem(key, JSON.stringify(answers));
  } catch (error) {
    console.warn('Gagal menyimpan jawaban pengguna ke storage:', error);
  }
}

export function getUserAnswers(serviceId: string): UserAnswers | null {
  if (typeof window === 'undefined') return null;

  try {
    const key = `${STORAGE_PREFIX}${serviceId}`;
    const stored = sessionStorage.getItem(key);
    if (!stored) return null;
    return JSON.parse(stored) as UserAnswers;
  } catch (error) {
    console.warn('Gagal membaca jawaban pengguna dari storage:', error);
    return null;
  }
}

export function clearUserAnswers(serviceId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const key = `${STORAGE_PREFIX}${serviceId}`;
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn('Gagal menghapus jawaban pengguna dari storage:', error);
  }
}
