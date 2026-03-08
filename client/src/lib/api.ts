import { queryClient } from "./queryClient";

export async function apiRequest(method: string, url: string, body?: any): Promise<Response> {
  const opts: RequestInit = {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    credentials: "include",
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.message || "Request failed");
  }
  return res;
}

export function getQueryFn<T>(url: string) {
  return async (): Promise<T> => {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || err.message || "Request failed");
    }
    return res.json();
  };
}
