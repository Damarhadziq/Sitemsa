import { generateUUID } from './uuid';

/**
 * SITEMSA Standard Entity ID Generator (RFC4122 UUID v4)
 */
export function generateEntityId(
  type?: 'mod' | 'quiz' | 'q',
  subject?: string,
  teacherId?: string
): string {
  return generateUUID();
}

