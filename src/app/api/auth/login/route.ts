import { NextRequest } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { loginSchema } from '@/lib/validations';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const session = AuthService.login(validated.email, validated.password);
    if (!session) {
      return apiError('Kredensial login tidak valid', 401);
    }

    const response = apiSuccess(session, 'Login berhasil');

    // Set secure cookie
    const isTeacherOrAdmin = session.role === 'superadmin' || session.role === 'guru';
    const cookieName = isTeacherOrAdmin ? 'auth_admin' : 'auth';
    const cookieVal = isTeacherOrAdmin ? session.role : 'true';

    response.cookies.set(cookieName, cookieVal, {
      path: '/',
      maxAge: 604800, // 7 days
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
