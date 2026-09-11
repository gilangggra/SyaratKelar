const STORAGE_PREFIX = 'ceklayanan_checklist_';

export interface StoredChecklist {
  serviceId: string;
  checkedIds: string[];
  lastUpdated: string;
}

export function saveChecklistState(serviceId: string, checkedIds: string[]): void {
  if (typeof window === 'undefined') return;

  try {
    const key = `${STORAGE_PREFIX}${serviceId}`;
    const payload: StoredChecklist = {
      serviceId,
      checkedIds,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (error) {
    console.warn('Gagal menyimpan status checklist ke LocalStorage:', error);
  }
}

export function getChecklistState(serviceId: string): string[] | null {
  if (typeof window === 'undefined') return null;

  try {
    const key = `${STORAGE_PREFIX}${serviceId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredChecklist;
    if (parsed && Array.isArray(parsed.checkedIds)) {
      return parsed.checkedIds;
    }
    return null;
  } catch (error) {
    console.warn('Gagal membaca status checklist dari LocalStorage:', error);
    return null;
  }
}

export function clearChecklistState(serviceId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const key = `${STORAGE_PREFIX}${serviceId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Gagal menghapus status checklist dari LocalStorage:', error);
  }
}
