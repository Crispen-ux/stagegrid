export interface ApiSuccess<T> {
  ok: true;
  status: number;
  data: T;
}

export interface ApiFailure {
  ok: false;
  status: number;
  error?: string;
  errors?: Record<string, string>;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

async function request<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, init);
    const data = (await res.json().catch(() => ({}))) as T & {
      error?: string;
      errors?: Record<string, string>;
    };
    if (!res.ok) {
      return { ok: false, status: res.status, error: data.error, errors: data.errors };
    }
    return { ok: true, status: res.status, data };
  } catch {
    return { ok: false, status: 0, error: "Network error — please check your connection and try again." };
  }
}

export function submitJson<T>(url: string, body: unknown): Promise<ApiResult<T>> {
  return request<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function fetchJson<T>(url: string): Promise<ApiResult<T>> {
  return request<T>(url, { headers: { Accept: "application/json" } });
}
