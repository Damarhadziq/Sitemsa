import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: unknown;
}

export function apiSuccess<T>(data: T, message?: string, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function apiError(error: string, status = 400, details?: unknown) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
      details,
    },
    { status }
  );
}

export function handleApiError(err: unknown) {
  console.error('[API Error Handler]:', err);

  if (err instanceof ZodError) {
    return apiError('Validasi input gagal', 422, err.flatten().fieldErrors);
  }

  if (err instanceof Error) {
    return apiError(err.message, 400);
  }

  return apiError('Terjadi kesalahan internal server', 500);
}
