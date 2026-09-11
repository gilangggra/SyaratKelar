'use client';

import { useSyncExternalStore } from 'react';

/**
 * Hook untuk membaca dan berlangganan nilai dari localStorage secara aman dari SSR hydration mismatch
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (val: T | ((prev: T) => T)) => void] {
  const getSnapshot = (): string => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : JSON.stringify(initialValue);
    } catch {
      return JSON.stringify(initialValue);
    }
  };

  const getServerSnapshot = (): string => {
    return JSON.stringify(initialValue);
  };

  const subscribe = (callback: () => void): (() => void) => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) {
        callback();
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener(`local-storage-${key}`, callback);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(`local-storage-${key}`, callback);
    };
  };

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  let value: T;
  try {
    value = JSON.parse(raw);
  } catch {
    value = initialValue;
  }

  const setValue = (val: T | ((prev: T) => T)) => {
    try {
      const nextValue = val instanceof Function ? val(value) : val;
      localStorage.setItem(key, JSON.stringify(nextValue));
      window.dispatchEvent(new Event(`local-storage-${key}`));
    } catch (e) {
      console.warn('Gagal menyimpan data ke localStorage:', e);
    }
  };

  return [value, setValue];
}

/**
 * Hook untuk membaca dan berlangganan nilai dari sessionStorage secara aman dari SSR hydration mismatch
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (val: T | ((prev: T) => T)) => void] {
  const getSnapshot = (): string => {
    try {
      const item = sessionStorage.getItem(key);
      return item !== null ? item : JSON.stringify(initialValue);
    } catch {
      return JSON.stringify(initialValue);
    }
  };

  const getServerSnapshot = (): string => {
    return JSON.stringify(initialValue);
  };

  const subscribe = (callback: () => void): (() => void) => {
    window.addEventListener(`session-storage-${key}`, callback);
    return () => {
      window.removeEventListener(`session-storage-${key}`, callback);
    };
  };

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  let value: T;
  try {
    value = JSON.parse(raw);
  } catch {
    value = initialValue;
  }

  const setValue = (val: T | ((prev: T) => T)) => {
    try {
      const nextValue = val instanceof Function ? val(value) : val;
      sessionStorage.setItem(key, JSON.stringify(nextValue));
      window.dispatchEvent(new Event(`session-storage-${key}`));
    } catch (e) {
      console.warn('Gagal menyimpan data ke sessionStorage:', e);
    }
  };

  return [value, setValue];
}
