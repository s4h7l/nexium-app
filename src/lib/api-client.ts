export class ClientError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
  }
}

export async function postJson<T>(url: string, body: unknown, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch {
    if (signal?.aborted) throw new ClientError("Cancelled.", "cancelled");
    throw new ClientError("Network problem — couldn't reach the server. Check your connection.", "network");
  }
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON */
  }
  if (!res.ok) {
    throw new ClientError(
      data?.error || (res.status === 504 ? "The request timed out. Please try again." : `Request failed (${res.status}).`),
      data?.code || "http_" + res.status,
    );
  }
  return data as T;
}
