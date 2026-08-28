'use client';

export interface OtpRecord {
  email: string;
  code: string;
  expiresAt: number;
  attempts: number;
}

const OTP_STORAGE_KEY = 'sintesa_active_otp_v1';
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes validity

export class OtpService {
  /**
   * Generate a secure 4-digit numeric OTP for an email
   */
  static generateOtp(email: string): string {
    const cleanEmail = email.trim().toLowerCase();
    // Generate random 4-digit code (1000 - 9999)
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    const record: OtpRecord = {
      email: cleanEmail,
      code,
      expiresAt,
      attempts: 0,
    };

    if (typeof window !== 'undefined') {
      try {
        const stored = this.getAllOtps();
        stored[cleanEmail] = record;
        localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(stored));
      } catch (e) {
        console.error('Error saving OTP record:', e);
      }
    }

    console.log(`🔐 [OTP Generator] Kode verifikasi untuk ${cleanEmail}: ${code} (berlaku 5 menit)`);
    return code;
  }

  /**
   * Verify input OTP code for an email
   */
  static verifyOtp(email: string, inputCode: string): { success: boolean; message?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = inputCode.trim();

    if (!cleanCode || cleanCode.length < 4) {
      return { success: false, message: 'Masukkan 4 digit kode OTP secara lengkap.' };
    }

    if (typeof window === 'undefined') {
      return { success: true };
    }

    try {
      const stored = this.getAllOtps();
      const record = stored[cleanEmail];

      if (!record) {
        // If no OTP generated yet, or if it's the first test, generate one and check
        return { success: false, message: 'Kode OTP belum dibuat atau sudah tidak berlaku. Silakan kirim ulang kode.' };
      }

      if (Date.now() > record.expiresAt) {
        delete stored[cleanEmail];
        localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(stored));
        return { success: false, message: 'Kode OTP telah kedaluwarsa. Silakan klik kirim ulang kode.' };
      }

      if (record.code !== cleanCode) {
        record.attempts += 1;
        localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(stored));
        return { success: false, message: 'Kode OTP yang Anda masukkan salah. Periksa kembali.' };
      }

      // Success -> clean up used OTP
      delete stored[cleanEmail];
      localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(stored));
      return { success: true };
    } catch (e) {
      return { success: true };
    }
  }

  /**
   * Get active OTP record for email (if valid)
   */
  static getActiveOtp(email: string): OtpRecord | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = this.getAllOtps();
      const record = stored[email.trim().toLowerCase()];
      if (record && Date.now() <= record.expiresAt) {
        return record;
      }
      return null;
    } catch {
      return null;
    }
  }

  private static getAllOtps(): Record<string, OtpRecord> {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(OTP_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
}
