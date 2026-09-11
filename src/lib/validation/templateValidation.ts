import { TemplateField } from '@/types';

export interface ValidationErrors {
  [fieldId: string]: string;
}

export function validateTemplateForm(
  fields: TemplateField[],
  values: Record<string, string>
): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  for (const field of fields) {
    const rawVal = values[field.id];
    const val = rawVal ? rawVal.trim() : '';

    if (field.required && !val) {
      errors[field.id] = `${field.label} wajib diisi.`;
      continue;
    }

    // Special validation for NIK
    if (field.id.toLowerCase().includes('nik') && val) {
      if (!/^\d{16}$/.test(val)) {
        errors[field.id] = 'NIK harus berupa 16 digit angka sesuai KTP/KK.';
      }
    }

    // Special validation for date
    if (field.type === 'date' && val) {
      const parsed = Date.parse(val);
      if (isNaN(parsed)) {
        errors[field.id] = 'Format tanggal tidak valid.';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
