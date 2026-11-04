import { UserAnswers } from '@/types';

const STORAGE_PREFIX = 'ceklayanan_answers_';

export function saveUserAnswers(serviceId: string, answers: UserAnswers): void {
  if (typeof window === 'undefined') return;

  try {
    const key = `${STORAGE_PREFIX}${serviceId}`;
    const serialized = JSON.stringify(answers);
    localStorage.setItem(key, serialized);
    sessionStorage.setItem(key, serialized);
    window.dispatchEvent(new Event(`local-storage-${key}`));
    window.dispatchEvent(new Event(`session-storage-${key}`));
  } catch (error) {
    console.warn('Gagal menyimpan jawaban pengguna ke storage:', error);
  }
}

export function getUserAnswers(serviceId: string): UserAnswers | null {
  if (typeof window === 'undefined') return null;

  try {
    const key = `${STORAGE_PREFIX}${serviceId}`;
    const storedLocal = localStorage.getItem(key);
    if (storedLocal) {
      return JSON.parse(storedLocal) as UserAnswers;
    }
    const storedSession = sessionStorage.getItem(key);
    if (storedSession) {
      return JSON.parse(storedSession) as UserAnswers;
    }
    return null;
  } catch (error) {
    console.warn('Gagal membaca jawaban pengguna dari storage:', error);
    return null;
  }
}

export function clearUserAnswers(serviceId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const key = `${STORAGE_PREFIX}${serviceId}`;
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
    window.dispatchEvent(new Event(`local-storage-${key}`));
    window.dispatchEvent(new Event(`session-storage-${key}`));
  } catch (error) {
    console.warn('Gagal menghapus jawaban pengguna dari storage:', error);
  }
}
