import { NextResponse } from 'next/server';
import { apiSuccess } from '@/lib/api-response';

export async function POST() {
  const response = apiSuccess(null, 'Logout berhasil');

  // Clear auth cookies
  response.cookies.delete('auth_admin');
  response.cookies.delete('auth');
  response.cookies.delete('auth_student');

  return response;
}
