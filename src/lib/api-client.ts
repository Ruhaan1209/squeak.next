type APIResponse<T> = { data: T | null; error: { error: string; code?: string } | null };

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<APIResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`/api${path}`, { ...options, headers });
    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json };
    }

    return { data: json as T, error: null };
  } catch (err) {
    return {
      data: null,
      error: { error: err instanceof Error ? err.message : 'Unknown error' },
    };
  }
}
