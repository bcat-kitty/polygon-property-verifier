import type {
  ApiErrorResponse,
  Property,
  VerifyHashResponse,
} from "./types";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

async function jsonFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  const body = (await res.json().catch(() => null)) as
    | (T & { success: true })
    | ApiErrorResponse
    | null;
  if (!res.ok || !body || (body as ApiErrorResponse).success === false) {
    const message =
      (body as ApiErrorResponse | null)?.error ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return body as T;
}

export async function fetchProperties(): Promise<Property[]> {
  const data = await jsonFetch<{ success: true; properties: Property[] }>(
    "/api/properties"
  );
  return data.properties;
}

export async function fetchProperty(id: number): Promise<Property> {
  const data = await jsonFetch<{ success: true; property: Property }>(
    `/api/properties/${id}`
  );
  return data.property;
}

export async function verifyPropertyHash(
  id: number
): Promise<VerifyHashResponse> {
  return jsonFetch<VerifyHashResponse>(`/api/properties/verify/${id}`, {
    method: "POST",
  });
}
