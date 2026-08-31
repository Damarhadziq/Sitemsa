/**
 * Standard RFC4122 UUID v4 Generator & Deterministic ID Resolver for SITEMSA
 */

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // RFC4122 v4 fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function isUUID(val?: string | null): boolean {
  if (!val || typeof val !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val.trim());
}

/**
 * Deterministically map legacy plain/integer/slug IDs to valid RFC4122 UUID format
 * Example: '1' -> 'e0000001-0000-4000-8000-000000000001'
 * Example: 'mod-ot-01' -> 'b0407001-0000-4000-8000-000000000001'
 */
export function toDeterministicUUID(seed: string | number): string {
  const str = String(seed || '').trim();
  if (isUUID(str)) return str.toLowerCase();

  // Simple FNV-1a hash to 32 hex digits formatted as UUID
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  let h3 = 0x5bd1e995;
  let h4 = 0x27d4eb2f;

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 0x01000193);
    h2 = Math.imul(h2 ^ (code + i), 0x01000193);
    h3 = Math.imul(h3 ^ (code * 31), 0x01000193);
    h4 = Math.imul(h4 ^ (code * 17), 0x01000193);
  }

  const p1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const p2 = ((h2 >>> 16) & 0xffff).toString(16).padStart(4, '0');
  const p3 = '4' + ((h2 >>> 4) & 0x0fff).toString(16).padStart(3, '0');
  const p4 = ((0x80 | ((h3 >>> 24) & 0x3f))).toString(16) + ((h3 >>> 16) & 0xff).toString(16).padStart(2, '0');
  const p5 = ((h4 >>> 0).toString(16) + (h3 >>> 0).toString(16)).slice(0, 12).padStart(12, '0');

  return `${p1}-${p2}-${p3}-${p4.slice(0, 4)}-${p5}`.toLowerCase();
}
