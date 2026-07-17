import { logger } from "@/lib/logger";

export async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`/api/admin${path}`, { ...init, headers: init?.body instanceof FormData ? init.headers : { "content-type": "application/json", ...init?.headers } });
    const data = await response.json() as T & { error?: string };
    if (!response.ok) throw new Error(data.error ?? "تعذّر تنفيذ العملية");
    return data;
  } catch (error) {
    logger.error("admin.request_failed", { path, error: String(error) });
    throw error;
  }
}
