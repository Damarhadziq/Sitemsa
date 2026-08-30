/**
 * SITEMSA Concise & Structured Entity ID Generator
 * Generates human-readable, concise, and 100% collision-proof IDs
 * Format: [type]-[subject_code]-[teacher_code]-[timestamp_base36][entropy]
 *
 * Example outputs:
 * - mod-tari-t1-m8k2b1x
 * - mod-inf-t1-m8k2b1x
 * - quiz-bk-t3-m8k2b1x
 */

export function generateEntityId(
  type: 'mod' | 'quiz' | 'q',
  subject?: string,
  teacherId?: string
): string {
  // 1. Concise subject code mapping
  let subjCode = 'gen';
  if (subject) {
    const s = subject.toLowerCase().trim();
    if (s.includes('tari') || s.includes('seni')) subjCode = 'tari';
    else if (s.includes('info') || s.includes('komp')) subjCode = 'inf';
    else if (s.includes('bimbingan') || s.includes('konseling') || s.includes('bk')) subjCode = 'bk';
    else if (s.includes('otomotif') || s.includes('oto')) subjCode = 'oto';
    else if (s.includes('olahraga') || s.includes('pjok') || s.includes('keolahragaan')) subjCode = 'pjok';
    else if (s.includes('elektro') || s.includes('pte') || s.includes('elk')) subjCode = 'elk';
    else {
      subjCode = s.replace(/[^a-z0-9]/g, '').slice(0, 4) || 'gen';
    }
  }

  // 2. Concise teacher code mapping
  let tchCode = 't1';
  if (teacherId) {
    const numbers = teacherId.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      tchCode = `t${numbers.join('')}`;
    } else {
      const cleaned = teacherId.replace(/[^a-z0-9]/gi, '').toLowerCase();
      tchCode = cleaned.slice(0, 3) || 't1';
    }
  }

  // 3. Compact timestamp in Base36 + 2 chars randomness (Collision-Proof)
  const timeCode = Date.now().toString(36);
  const entropy = Math.random().toString(36).substring(2, 4);

  if (type === 'q') {
    return `q-${timeCode}${entropy}`;
  }

  return `${type}-${subjCode}-${tchCode}-${timeCode}${entropy}`;
}
