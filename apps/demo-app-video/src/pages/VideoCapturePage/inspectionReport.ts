import { getEnvOrThrow, zlibCompress } from '@monkvision/common';

export function createInspectionReportLink(
  authToken: string | null,
  inspectionId: string | null,
  language: string,
): string {
  const url = getEnvOrThrow('VITE_INSPECTION_REPORT_URL');
  const token = encodeURIComponent(zlibCompress(authToken ?? ''));
  return `${url}?c=e5j&lang=${language}&i=${inspectionId}&t=${token}`;
}
