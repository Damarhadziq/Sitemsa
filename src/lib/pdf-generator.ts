/**
 * Generate a 100% compliant, standard PDF-1.4 binary Blob that opens in all PDF viewers
 * (Chrome, Edge, Safari, Adobe Reader, etc.) without any parsing or xref errors.
 */
export function generateValidPdfBlob(
  title: string,
  subject: string,
  author: string,
  fileName?: string
): Blob {
  const cleanTitle = (title || 'Modul Pembelajaran').replace(/[\\()]/g, '');
  const cleanSubject = (subject || 'Umum').replace(/[\\()]/g, '');
  const cleanAuthor = (author || 'Pengajar Sitemsa').replace(/[\\()]/g, '');
  const cleanFileName = (fileName || 'Dokumen_Lampiran.pdf').replace(/[\\()]/g, '');
  const dateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const streamLines = [
    'BT',
    '/F1 18 Tf',
    '50 750 Td',
    `(${cleanTitle}) Tj`,
    'ET',
    'BT',
    '/F1 12 Tf',
    '50 715 Td',
    `(Mata Pelajaran: ${cleanSubject}) Tj`,
    'ET',
    'BT',
    '/F1 11 Tf',
    '50 690 Td',
    `(Penyusun / Pengajar: ${cleanAuthor}) Tj`,
    'ET',
    'BT',
    '/F1 10 Tf',
    '50 665 Td',
    `(Nama Berkas: ${cleanFileName}) Tj`,
    'ET',
    'BT',
    '/F1 10 Tf',
    '50 640 Td',
    `(Tanggal Diunduh: ${dateStr}) Tj`,
    'ET',
    'BT',
    '/F1 10 Tf',
    '50 595 Td',
    '(Dokumen Lampiran Resmi - Platform Pembelajaran Sitemsa) Tj',
    'ET',
    'BT',
    '/F1 9 Tf',
    '50 575 Td',
    '(Dokumen ini adalah berkas materi pembelajaran terverifikasi dari pengajar.) Tj',
    'ET',
    'BT',
    '/F1 9 Tf',
    '50 555 Td',
    '(Gunakan dokumen ini sebagai panduan belajar mandiri dan kegiatan praktikum.) Tj',
    'ET',
  ];

  const streamText = streamLines.join('\n');

  // Compute exact UTF-8 byte length
  const encoder = new TextEncoder();
  const streamByteLength = encoder.encode(streamText).length;

  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const obj3 =
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n';
  const obj4 = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  const obj5 = `5 0 obj\n<< /Length ${streamByteLength} >>\nstream\n${streamText}\nendstream\nendobj\n`;

  const header = '%PDF-1.4\n';
  const offset1 = encoder.encode(header).length;
  const offset2 = offset1 + encoder.encode(obj1).length;
  const offset3 = offset2 + encoder.encode(obj2).length;
  const offset4 = offset3 + encoder.encode(obj3).length;
  const offset5 = offset4 + encoder.encode(obj4).length;
  const xrefOffset = offset5 + encoder.encode(obj5).length;

  const pad = (num: number) => String(num).padStart(10, '0');

  const xref = [
    'xref',
    '0 6',
    '0000000000 65535 f ',
    `${pad(offset1)} 00000 n `,
    `${pad(offset2)} 00000 n `,
    `${pad(offset3)} 00000 n `,
    `${pad(offset4)} 00000 n `,
    `${pad(offset5)} 00000 n `,
    'trailer',
    '<< /Size 6 /Root 1 0 R >>',
    'startxref',
    String(xrefOffset),
    '%%EOF\n',
  ].join('\n');

  const fullPdfString = header + obj1 + obj2 + obj3 + obj4 + obj5 + xref;
  const pdfBytes = encoder.encode(fullPdfString);

  return new Blob([pdfBytes], { type: 'application/pdf' });
}
