import { Requirement, Service } from '@/types';

export interface CustomItem {
  id: string;
  text: string;
  isChecked: boolean;
}

export interface FormatChecklistShareOptions {
  service: Service;
  mandatoryRequirements: Requirement[];
  conditionalRequirements: Requirement[];
  checkedIds: string[];
  customItems?: CustomItem[];
  conditions?: { questionTitle: string; answerLabel: string }[];
  appUrl?: string;
}

/**
 * Memformat ringkasan checklist persyaratan menjadi teks pesan terstruktur
 * yang rapi dan mudah dibaca saat dikirim via WhatsApp atau disalin ke catatan.
 */
export function formatChecklistShareText(options: FormatChecklistShareOptions): string {
  const {
    service,
    mandatoryRequirements,
    conditionalRequirements,
    checkedIds,
    customItems = [],
    conditions = [],
    appUrl,
  } = options;

  const lines: string[] = [];

  // Header
  lines.push(`📋 *CHECKLIST PERSYARATAN: ${service.name.toUpperCase()}*`);
  lines.push(`🏛️ *Lokasi Pengurusan:* ${service.destinationAgency}`);
  lines.push(`💰 *Biaya Resmi:* ${service.fees.isFree ? 'Gratis Rp0 (Bebas Biaya)' : 'Sesuai Ketentuan'}`);
  
  if (service.estimatedTime) {
    lines.push(`⏱️ *Estimasi Waktu:* ${service.estimatedTime}`);
  }

  // Selected Conditions
  if (conditions.length > 0) {
    lines.push('');
    lines.push('📌 *Kondisi Pengajuan:*');
    conditions.forEach((cond) => {
      lines.push(`• ${cond.answerLabel}`);
    });
  }

  // Mandatory Requirements
  if (mandatoryRequirements.length > 0) {
    lines.push('');
    lines.push('📁 *DOKUMEN WAJIB:*');
    mandatoryRequirements.forEach((req) => {
      const isChecked = checkedIds.includes(req.id);
      const icon = isChecked ? '✅ [SIAP]' : '⬜ [BELUM]';
      lines.push(`${icon} ${req.title}`);
    });
  }

  // Conditional Requirements
  if (conditionalRequirements.length > 0) {
    lines.push('');
    lines.push('📂 *DOKUMEN TAMBAHAN (SESUAI KONDISI):*');
    conditionalRequirements.forEach((req) => {
      const isChecked = checkedIds.includes(req.id);
      const icon = isChecked ? '✅ [SIAP]' : '⬜ [BELUM]';
      lines.push(`${icon} ${req.title}`);
    });
  }

  // Custom Personal Items
  if (customItems.length > 0) {
    lines.push('');
    lines.push('📝 *PERLENGKAPAN TAMBAHAN PRIBADI:*');
    customItems.forEach((item) => {
      const icon = item.isChecked ? '✅ [SIAP]' : '⬜ [BELUM]';
      lines.push(`${icon} ${item.text}`);
    });
  }

  // Status Summary
  const allReqs = [...mandatoryRequirements, ...conditionalRequirements];
  const totalCount = allReqs.length + customItems.length;
  const checkedCount =
    checkedIds.filter((id) => allReqs.some((r) => r.id === id)).length +
    customItems.filter((i) => i.isChecked).length;

  lines.push('');
  lines.push(`📊 *Status Kesiapan:* ${checkedCount} dari ${totalCount} perlengkapan siap`);

  // Helpful Advice
  lines.push('');
  lines.push('💡 *Tips Sebelum Berangkat ke Loket:*');
  lines.push('• Bawa dokumen fisik asli dan fotokopi minimal 2 lembar.');
  lines.push('• Bawa pulpen tinta hitam untuk pengisian formulir fisik di lokasi.');
  lines.push('• Pastikan datang pada jam pelayanan loket (pagi hari lebih disarankan).');

  // Attribution
  lines.push('');
  lines.push(`_Dipersiapkan secara mandiri melalui CekLayanan${appUrl ? ` — ${appUrl}` : ''}_`);

  return lines.join('\n');
}

/**
 * Menghasilkan tautan langsung WhatsApp dengan teks pesan yang sudah di-encode.
 */
export function generateWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
