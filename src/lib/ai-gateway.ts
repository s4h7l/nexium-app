// Server-only helper: calls Google Gemini through the built-in Lovable AI Gateway.
// The key is read inside the function from server env and never reaches the browser.

export const GEMINI_MODEL = "google/gemini-3-flash-preview";
const ENDPOINT = "https://ai.gateway.lovable.dev/v1/chat/completions";

export class AiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code: string,
  ) {
    super(message);
  }
}

type Msg = { role: "system" | "user" | "assistant"; content: string };

export async function callGemini(opts: {
  messages: Msg[];
  jsonSchema?: Record<string, unknown>;
  signal?: AbortSignal;
}): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AiError(503, "Gemini is not connected on the server yet.", "missing_key");

  const body: Record<string, unknown> = { model: GEMINI_MODEL, messages: opts.messages, stream: true };
  if (opts.jsonSchema) {
    body["response_format"] = {
      type: "json_schema",
      json_schema: { name: "lesson", strict: true, schema: opts.jsonSchema },
    };
  }

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify(body),
      signal: opts.signal ?? null,
    });
  } catch (e) {
    if (opts.signal?.aborted) throw new AiError(499, "Request cancelled.", "cancelled");
    throw new AiError(502, "Could not reach Gemini. Check your connection and try again.", "network");
  }

  if (!res.ok) {
    let msg = "";
    try {
      const j = await res.json();
      msg = j?.error?.message || j?.message || "";
    } catch {
      /* ignore */
    }
    if (res.status === 429)
      throw new AiError(429, "Gemini is busy right now (rate limit). Please wait a minute and try again.", "rate_limited");
    if (res.status === 402)
      throw new AiError(402, msg || "The AI usage allowance has run out. Add credits to continue.", "quota");
    if (res.status === 401) throw new AiError(503, "Gemini credentials are invalid on the server.", "missing_key");
    if (res.status === 403) throw new AiError(403, msg || "Gemini refused access to this request.", "denied");
    if (res.status === 504 || res.status === 408)
      throw new AiError(504, "Gemini took too long to respond. Try a shorter length and retry.", "timeout");
    if (res.status >= 500) throw new AiError(502, "Gemini had a temporary problem. Please try again shortly.", "upstream");
    throw new AiError(400, msg || "Gemini could not process this request.", "bad_request");
  }

  // Consume the SSE stream server-side and accumulate the text.
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const t = line.trim();
        if (!t.startsWith("data:")) continue;
        const data = t.slice(5).trim();
        if (data === "[DONE]") continue;
        try {
          const j = JSON.parse(data);
          if (j.error) throw new AiError(502, j.error.message || "Gemini stream error.", "upstream");
          const delta = j.choices?.[0]?.delta?.content;
          if (typeof delta === "string") text += delta;
        } catch (e) {
          if (e instanceof AiError) throw e;
        }
      }
    }
  } catch (e) {
    if (e instanceof AiError) throw e;
    if (opts.signal?.aborted) throw new AiError(499, "Request cancelled.", "cancelled");
    throw new AiError(502, "The connection to Gemini was interrupted. Please try again.", "network");
  }

  if (!text.trim()) throw new AiError(502, "Gemini returned an empty response (it may have declined). Try rephrasing.", "empty");
  return text;
}

export function errorResponse(e: unknown) {
  const err = e instanceof AiError ? e : new AiError(500, "Something went wrong on the server.", "server");
  if (!(e instanceof AiError)) console.error(e);
  return Response.json({ error: err.message, code: err.code }, { status: err.status });
}
