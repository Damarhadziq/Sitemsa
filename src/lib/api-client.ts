// SINTESA Frontend API Client SDK

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  details?: unknown;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  const json: ApiResponse<T> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || json.message || 'Permintaan gagal');
  }

  return json.data;
}

export const api = {
  auth: {
    login: (email: string, password?: string) =>
      fetchJson('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: (userId: string) => fetchJson(`/api/auth/me?userId=${encodeURIComponent(userId)}`),
    logout: () => fetchJson('/api/auth/logout', { method: 'POST' }),
  },
  subjects: {
    list: () => fetchJson('/api/subjects'),
    get: (id: string) => fetchJson(`/api/subjects/${id}`),
    create: (data: unknown) => fetchJson('/api/subjects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => fetchJson(`/api/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/api/subjects/${id}`, { method: 'DELETE' }),
  },
  teachers: {
    list: () => fetchJson('/api/teachers'),
    get: (id: string) => fetchJson(`/api/teachers/${id}`),
    create: (data: unknown) => fetchJson('/api/teachers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => fetchJson(`/api/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/api/teachers/${id}`, { method: 'DELETE' }),
    assignSubjects: (id: string, assignedSubjects: string[]) =>
      fetchJson(`/api/teachers/${id}/subjects`, {
        method: 'PUT',
        body: JSON.stringify({ assignedSubjects }),
      }),
  },
  modules: {
    list: (params?: { subject?: string; level?: string; teacherId?: string }) => {
      const q = new URLSearchParams();
      if (params?.subject) q.set('subject', params.subject);
      if (params?.level) q.set('level', params.level);
      if (params?.teacherId) q.set('teacherId', params.teacherId);
      const qs = q.toString() ? `?${q.toString()}` : '';
      return fetchJson(`/api/modules${qs}`);
    },
    get: (id: string) => fetchJson(`/api/modules/${id}`),
    create: (data: unknown) => fetchJson('/api/modules', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => fetchJson(`/api/modules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/api/modules/${id}`, { method: 'DELETE' }),
  },
  quizzes: {
    list: (params?: { subject?: string; teacherId?: string; publishedOnly?: boolean }) => {
      const q = new URLSearchParams();
      if (params?.subject) q.set('subject', params.subject);
      if (params?.teacherId) q.set('teacherId', params.teacherId);
      if (params?.publishedOnly) q.set('publishedOnly', 'true');
      const qs = q.toString() ? `?${q.toString()}` : '';
      return fetchJson(`/api/quizzes${qs}`);
    },
    get: (id: string, role?: string) => {
      const qs = role ? `?role=${role}` : '';
      return fetchJson(`/api/quizzes/${id}${qs}`);
    },
    create: (data: unknown) => fetchJson('/api/quizzes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => fetchJson(`/api/quizzes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/api/quizzes/${id}`, { method: 'DELETE' }),
    submit: (id: string, payload: { studentId: string; answers: { questionId: string; selectedAnswer: number }[] }) =>
      fetchJson(`/api/quizzes/${id}/submit`, { method: 'POST', body: JSON.stringify(payload) }),
  },
  students: {
    getProgress: (studentId: string) => fetchJson(`/api/students/progress?studentId=${studentId}`),
    updateProgress: (studentId: string, subject: string, progress: number) =>
      fetchJson('/api/students/progress', {
        method: 'POST',
        body: JSON.stringify({ studentId, subject, progress }),
      }),
    monitoring: (subject?: string) => {
      const qs = subject ? `?subject=${encodeURIComponent(subject)}` : '';
      return fetchJson(`/api/students/monitoring${qs}`);
    },
  },
  articles: {
    list: (params?: { category?: string; featuredOnly?: boolean }) => {
      const q = new URLSearchParams();
      if (params?.category) q.set('category', params.category);
      if (params?.featuredOnly) q.set('featuredOnly', 'true');
      const qs = q.toString() ? `?${q.toString()}` : '';
      return fetchJson(`/api/articles${qs}`);
    },
    get: (id: string) => fetchJson(`/api/articles/${id}`),
    create: (data: unknown) => fetchJson('/api/articles', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => fetchJson(`/api/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/api/articles/${id}`, { method: 'DELETE' }),
  },
  cms: {
    getHero: () => fetchJson('/api/cms/hero'),
    updateHero: (data: unknown) => fetchJson('/api/cms/hero', { method: 'PUT', body: JSON.stringify(data) }),
  },
  notifications: {
    list: (userId?: string) => {
      const qs = userId ? `?userId=${userId}` : '';
      return fetchJson(`/api/notifications${qs}`);
    },
    create: (data: unknown) => fetchJson('/api/notifications', { method: 'POST', body: JSON.stringify(data) }),
    markRead: (id: string) => fetchJson(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  },
};
