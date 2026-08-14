'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(prevState: unknown, formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (email === 'admin' && password === 'admin') {
    const cookieStore = await cookies()
    cookieStore.set('auth', 'true', { path: '/' })
    // We cannot redirect inside try-catch easily without throwing, but here we can just return or redirect.
    // Actually, redirect throws an error that Next.js catches.
  } else {
    return { error: 'Email atau kata sandi salah' }
  }

  redirect('/')
}
