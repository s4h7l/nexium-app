import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AiError, callGemini, errorResponse } from "@/lib/ai-gateway";
import { LANGUAGES, LEVELS } from "@/lib/lesson";

export const MAX_HISTORY = 12;

const schema = z.object({
  level: z.enum(LEVELS),
  language: z.enum(LANGUAGES),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) }))
    .min(1),
});

export const Route = createFileRoute("/api/tutor")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const parsed = schema.safeParse(await request.json().catch(() => null));
          if (!parsed.success) throw new AiError(400, "Invalid chat request.", "invalid_input");
          const { level, language } = parsed.data;
          const history = parsed.data.messages.slice(-MAX_HISTORY);
          const reply = await callGemini({
            messages: [
              {
                role: "system",
                content: `You are a patient, accurate tutor in AI Education Assistant. Reply in ${language}, pitched at a ${level} learner. Explain step by step, check understanding with a short follow-up question when useful, and keep answers focused (under ~300 words unless asked). Use plain text; bullet lines start with '- '; put code in triple-backtick blocks.`,
              },
              ...history,
            ],
            signal: request.signal,
          });
          return Response.json({ reply: reply.trim() });
        } catch (e) {
          return errorResponse(e);
        }
      },
    },
  },
});
