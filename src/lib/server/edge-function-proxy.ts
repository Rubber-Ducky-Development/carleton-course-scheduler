import 'server-only';

type Semester = 'fall' | 'winter';

function getEdgeFunctionBaseUrl() {
  const raw = process.env.SUPABASE_EDGE_FUNCTION_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) {
    throw new Error('Missing Supabase edge function URL');
  }

  return raw.replace(/\/$/, '').endsWith('/functions/v1')
    ? raw.replace(/\/$/, '')
    : `${raw.replace(/\/$/, '')}/functions/v1`;
}

function getServerAuthHeaders() {
  const authKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.API_KEY;
  const headers: Record<string, string> = {};

  if (authKey) {
    headers.Authorization = `Bearer ${authKey}`;
    headers.apikey = authKey;
  }

  const apiKey = process.env.API_KEY;
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  return headers;
}

export async function callEdgeFunction<T>(functionName: 'validate-courses' | 'filter-courses', payload: unknown, semester: Semester) {
  const response = await fetch(`${getEdgeFunctionBaseUrl()}/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Term': semester,
      ...getServerAuthHeaders(),
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Edge function ${functionName} returned ${response.status}`);
  }

  return await response.json() as T;
}

export function normalizeSemester(value: unknown): Semester {
  if (value === 'fall' || value === 'winter') {
    return value;
  }

  throw new Error('Invalid or missing semester. X-Term header must be either "fall" or "winter"');
}
